/**
 * Terminal RAG Router
 * 
 * tRPC router for the Admin Terminal RAG assistant.
 * All procedures enforce strict intake scoping and authorization.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import { getSupabaseAdmin } from "./supabase";
import { invokeLLM } from "./_core/llm";
import { buildContextPack, formatContextPackForLLM, verifyIntakeAccess } from "./terminal-context";
import { searchUploadText, processAllUploadsForIntake } from "./terminal-text-extraction";
import { searchStatutes, searchCourtListener, getStatutesByPracticeArea } from "./terminal-legal-tools";
import type { Citation, SuggestedAction, TerminalQueryOutput } from "./terminal-types";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

// Zod schemas
const citationSchema = z.object({
  type: z.enum(["INTAKE", "NOTE", "UPLOAD", "STATUTE", "CASELAW"]),
  id: z.union([z.number(), z.string()]),
  file_name: z.string().optional(),
  citation: z.string().optional(),
  url: z.string().optional(),
});

const suggestedActionSchema = z.object({
  label: z.string(),
  action: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const terminalRouter = router({
  /**
   * Query the terminal assistant
   * Main RAG pipeline with strict intake scoping
   */
  query: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      sessionId: z.string().uuid().optional(),
      query: z.string().min(1).max(4000),
      tools: z.array(z.enum(["statutes", "caselaw", "uploads"])).optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<TerminalQueryOutput> => {
      const supabase = getSupabaseAdmin();
      const userId = ctx.user.id;
      const userRole = ctx.user.role;
      
      // Verify intake access
      const hasAccess = await verifyIntakeAccess(input.intakeId, userId, userRole);
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      // If sessionId provided, verify it's pinned to the same intake
      let sessionId = input.sessionId;
      if (sessionId) {
        const { data: session } = await supabase
          .from("terminal_sessions")
          .select("intake_id")
          .eq("id", sessionId)
          .single();
        
        if (session && session.intake_id !== input.intakeId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Session is pinned to a different intake. Please create a new session.",
          });
        }
      }
      
      // Create new session if not provided
      if (!sessionId) {
        const { data: newSession, error: sessionError } = await supabase
          .from("terminal_sessions")
          .insert({
            user_id: userId,
            intake_id: input.intakeId,
            title: input.query.substring(0, 100),
          })
          .select("id")
          .single();
        
        if (sessionError || !newSession) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create session",
          });
        }
        sessionId = newSession.id;
      }
      
      // Save user message
      await supabase.from("terminal_messages").insert({
        session_id: sessionId,
        role: "user",
        content: input.query,
      });
      
      // Build context pack
      const contextPack = await buildContextPack(input.intakeId, userId);
      const contextString = formatContextPackForLLM(contextPack);
      
      // Gather additional context based on tools requested
      const citations: Citation[] = [];
      let additionalContext = "";
      
      // Search upload text if requested or if query mentions documents
      const shouldSearchUploads = input.tools?.includes("uploads") || 
        /document|file|upload|evidence|report|record/i.test(input.query);
      
      if (shouldSearchUploads && contextPack.uploads.length > 0) {
        const uploadResults = await searchUploadText(input.intakeId, input.query, 3);
        if (uploadResults.length > 0) {
          additionalContext += "\n\n## RELEVANT DOCUMENT EXCERPTS\n";
          for (const result of uploadResults) {
            additionalContext += `\n### From: ${result.file_name}\n${result.snippet}\n`;
            citations.push({
              type: "UPLOAD",
              id: result.upload_id,
              file_name: result.file_name,
            });
          }
        }
      }
      
      // Search statutes if requested
      const shouldSearchStatutes = input.tools?.includes("statutes") ||
        /statute|law|code|section|legal|regulation/i.test(input.query);
      
      if (shouldSearchStatutes) {
        // Get practice-area specific statutes
        if (contextPack.intake.practice_area) {
          const practiceStatutes = await getStatutesByPracticeArea(contextPack.intake.practice_area, 3);
          if (practiceStatutes.length > 0) {
            additionalContext += "\n\n## RELEVANT CALIFORNIA STATUTES\n";
            for (const statute of practiceStatutes) {
              additionalContext += `\n### ${statute.citation}\n**${statute.title}**\n${statute.excerpt}\n`;
              citations.push({
                type: "STATUTE",
                id: statute.id,
                citation: statute.citation,
              });
            }
          }
        }
        
        // Also search by query keywords
        const statuteResults = await searchStatutes(input.query, "CA", undefined, 3);
        for (const statute of statuteResults) {
          if (!citations.some(c => c.type === "STATUTE" && c.id === statute.id)) {
            additionalContext += `\n### ${statute.citation}\n**${statute.title}**\n${statute.excerpt}\n`;
            citations.push({
              type: "STATUTE",
              id: statute.id,
              citation: statute.citation,
            });
          }
        }
      }
      
      // Search case law if requested
      const shouldSearchCaselaw = input.tools?.includes("caselaw") ||
        /case law|precedent|ruling|decision|court|opinion/i.test(input.query);
      
      if (shouldSearchCaselaw) {
        const caselawResults = await searchCourtListener(input.query, undefined, undefined, 3);
        if (caselawResults.length > 0) {
          additionalContext += "\n\n## RELEVANT CASE LAW\n";
          for (const caselaw of caselawResults) {
            additionalContext += `\n### ${caselaw.title}\n**${caselaw.court}** (${caselaw.date})\n${caselaw.excerpt}\n[View full opinion](${caselaw.url})\n`;
            citations.push({
              type: "CASELAW",
              id: caselaw.id,
              citation: caselaw.citation,
              url: caselaw.url,
            });
          }
        }
      }
      
      // Build system prompt with strict scoping instructions
      const systemPrompt = `You are a legal research assistant for Gurovich Law Group. You are helping analyze a specific client matter (intake).

## CRITICAL RULES
1. Use ONLY the provided scope data. Do not assume facts not in scope.
2. Cite every key claim with record IDs in brackets, e.g., [INTAKE #123], [NOTE #45], [UPLOAD: filename.pdf].
3. If the question concerns another client or matter, instruct the user to switch scope.
4. Be precise and professional. Avoid speculation.
5. When referencing statutes, use proper citations like [CA CCP § 335.1].
6. When referencing case law, include the case name and year.

## ACTIVE SCOPE DATA
${contextString}
${additionalContext}

## YOUR CAPABILITIES
- Summarize intake information
- Analyze uploaded documents (if text extracted)
- Research California statutes
- Search case law via CourtListener
- Identify missing information
- Suggest discovery tasks and next steps

Respond in markdown format. Be concise but thorough.`;

      // Call LLM
      const llmResponse = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.query },
        ],
      });
      
      const rawContent = llmResponse.choices[0]?.message?.content;
      const answer = typeof rawContent === "string" 
        ? rawContent 
        : Array.isArray(rawContent) 
          ? rawContent.filter(c => c.type === "text").map(c => (c as any).text).join("\n")
          : "I was unable to generate a response.";
      
      // Generate suggested actions based on context
      const suggestedActions: SuggestedAction[] = [];
      
      // Add intake citation
      citations.unshift({
        type: "INTAKE",
        id: input.intakeId,
      });
      
      // Suggest actions based on query and context
      if (/summar/i.test(input.query)) {
        suggestedActions.push({
          label: "Save Summary as Draft",
          action: "saveDraft",
          payload: { type: "other", title: "Case Summary" },
        });
      }
      
      if (/discover/i.test(input.query) || /interrogator/i.test(input.query)) {
        suggestedActions.push({
          label: "Draft Discovery Requests",
          action: "saveDraft",
          payload: { type: "requests" },
        });
      }
      
      if (/witness/i.test(input.query) || /deposition/i.test(input.query)) {
        suggestedActions.push({
          label: "Generate Witness Topics",
          action: "saveDraft",
          payload: { type: "witness_topics" },
        });
      }
      
      if (contextPack.missing_info_hints.length > 0) {
        suggestedActions.push({
          label: "Create Task: Gather Missing Info",
          action: "createTask",
          payload: { title: "Gather missing information", description: contextPack.missing_info_hints.join("; ") },
        });
      }
      
      // Default suggestions
      if (suggestedActions.length === 0) {
        suggestedActions.push(
          { label: "Summarize Intake", action: "query", payload: { query: "Summarize this intake" } },
          { label: "Statute Lookup", action: "query", payload: { query: "What statutes apply to this case?", tools: ["statutes"] } },
          { label: "Case Law Search", action: "query", payload: { query: "Find relevant case law", tools: ["caselaw"] } },
        );
      }
      
      // Save assistant message
      await supabase.from("terminal_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: answer,
        citations: citations,
        suggested_actions: suggestedActions,
      });
      
      // Update session title if this is the first message
      await supabase
        .from("terminal_sessions")
        .update({ title: input.query.substring(0, 100) })
        .eq("id", sessionId);
      
      return {
        answer,
        citations,
        suggestedActions,
        sessionId: sessionId!,
      };
    }),

  /**
   * List sessions for an intake
   */
  listSessions: adminProcedure
    .input(z.object({
      intakeId: z.number().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      let query = supabase
        .from("terminal_sessions")
        .select(`
          id,
          intake_id,
          title,
          created_at,
          updated_at
        `)
        .eq("user_id", ctx.user.id)
        .order("updated_at", { ascending: false })
        .limit(input.limit);
      
      if (input.intakeId) {
        query = query.eq("intake_id", input.intakeId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return data || [];
    }),

  /**
   * Get a session with messages
   */
  getSession: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      // Get session
      const { data: session, error: sessionError } = await supabase
        .from("terminal_sessions")
        .select("*")
        .eq("id", input.sessionId)
        .eq("user_id", ctx.user.id)
        .single();
      
      if (sessionError || !session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }
      
      // Get messages
      const { data: messages } = await supabase
        .from("terminal_messages")
        .select("*")
        .eq("session_id", input.sessionId)
        .order("created_at", { ascending: true });
      
      return {
        ...session,
        messages: messages || [],
      };
    }),

  /**
   * Save a session (update title)
   */
  saveSession: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
      title: z.string().min(1).max(255),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const { error } = await supabase
        .from("terminal_sessions")
        .update({ title: input.title })
        .eq("id", input.sessionId)
        .eq("user_id", ctx.user.id);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return { success: true };
    }),

  /**
   * Delete a session
   */
  deleteSession: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const { error } = await supabase
        .from("terminal_sessions")
        .delete()
        .eq("id", input.sessionId)
        .eq("user_id", ctx.user.id);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return { success: true };
    }),

  /**
   * Process uploads for AI (extract text)
   */
  processUploads: adminProcedure
    .input(z.object({
      intakeId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const result = await processAllUploadsForIntake(input.intakeId);
      return result;
    }),

  /**
   * Create a discovery task from chat
   */
  createTask: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const { data, error } = await supabase
        .from("discovery_tasks")
        .insert({
          intake_id: input.intakeId,
          title: input.title,
          description: input.description,
          priority: input.priority,
          created_by_id: ctx.user.id,
          created_by_name: ctx.user.name,
        })
        .select("id")
        .single();
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return { id: data.id, success: true };
    }),

  /**
   * Save a discovery draft
   */
  saveDraft: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      type: z.enum(["requests", "witness_topics", "esi_plan", "proof_matrix", "other"]),
      title: z.string().optional(),
      content: z.record(z.string(), z.unknown()),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const { data, error } = await supabase
        .from("discovery_drafts")
        .insert({
          intake_id: input.intakeId,
          type: input.type,
          title: input.title,
          content: input.content,
          created_by_id: ctx.user.id,
          created_by_name: ctx.user.name,
        })
        .select("id")
        .single();
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return { id: data.id, success: true };
    }),

  /**
   * Get tasks for an intake
   */
  getTasks: adminProcedure
    .input(z.object({
      intakeId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const { data, error } = await supabase
        .from("discovery_tasks")
        .select("*")
        .eq("intake_id", input.intakeId)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return data || [];
    }),

  /**
   * Get drafts for an intake
   */
  getDrafts: adminProcedure
    .input(z.object({
      intakeId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const { data, error } = await supabase
        .from("discovery_drafts")
        .select("*")
        .eq("intake_id", input.intakeId)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return data || [];
    }),

  /**
   * Search documents for keywords
   */
  searchDocuments: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      query: z.string().min(1).max(500),
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ input, ctx }) => {
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const results = await searchUploadText(input.intakeId, input.query, input.limit);
      return results;
    }),

  /**
   * Get upload processing status for an intake
   */
  getUploadStatus: adminProcedure
    .input(z.object({
      intakeId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      // Get all uploads for intake
      const { data: uploads } = await supabase
        .from("intake_uploads")
        .select("id, file_name, mime_type, file_size")
        .eq("intake_id", input.intakeId);
      
      if (!uploads || uploads.length === 0) {
        return { total: 0, processed: 0, pending: 0, uploads: [] };
      }
      
      // Get which uploads have been processed
      const { data: processedUploads } = await supabase
        .from("upload_text")
        .select("upload_id, word_count")
        .eq("intake_id", input.intakeId);
      
      const processedMap = new Map(
        (processedUploads || []).map(p => [p.upload_id, p.word_count])
      );
      
      const uploadStatus = uploads.map(u => ({
        id: u.id,
        fileName: u.file_name,
        mimeType: u.mime_type,
        fileSize: u.file_size,
        processed: processedMap.has(u.id),
        wordCount: processedMap.get(u.id) || 0,
      }));
      
      return {
        total: uploads.length,
        processed: processedUploads?.length || 0,
        pending: uploads.length - (processedUploads?.length || 0),
        uploads: uploadStatus,
      };
    }),

  /**
   * Get list of intakes for dropdown (simplified)
   */
  getIntakeList: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      
      let query = supabase
        .from("intakes")
        .select(`
          id,
          first_name,
          last_name,
          practice_area,
          status,
          created_at
        `)
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(input.limit);
      
      if (input.search) {
        query = query.or(`first_name.ilike.%${input.search}%,last_name.ilike.%${input.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      
      return (data || []).map(intake => ({
        id: intake.id,
        label: `#${intake.id} - ${intake.first_name || ""} ${intake.last_name || ""}`.trim(),
        practiceArea: intake.practice_area,
        status: intake.status,
      }));
    }),
});
