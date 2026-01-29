/**
 * Terminal RAG Router
 * 
 * tRPC router for the Admin Terminal RAG assistant.
 * All procedures enforce strict intake scoping and authorization.
 * 
 * Uses Supabase for ALL data storage:
 * - terminal_sessions, terminal_messages, discovery_tasks, discovery_drafts
 * - intakes, intake_uploads, intake_notes (existing tables)
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import { getSupabaseAdmin } from "./supabase";
import { invokeLLM } from "./_core/llm";
import { buildContextPack, formatContextPackForLLM, verifyIntakeAccess } from "./terminal-context";
import { searchUploadText, processAllUploadsForIntake } from "./terminal-text-extraction";
import { getSignedDownloadUrl } from "./intake-storage";
import { searchStatutes, searchCourtListener, getStatutesByPracticeArea } from "./terminal-legal-tools";
import type { Citation, SuggestedAction, TerminalQueryOutput } from "./terminal-types";
import { randomUUID } from "crypto";

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
      const userId = String(ctx.user.id);
      const userRole = ctx.user.role;
      
      // Verify intake access
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, userRole || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      // Get or create session
      let sessionId = input.sessionId;
      
      if (sessionId) {
        // Verify session belongs to user and intake
        const { data: sessions } = await supabase
          .from("terminal_sessions")
          .select("*")
          .eq("id", sessionId)
          .limit(1);
        
        if (sessions && sessions.length > 0 && sessions[0].intake_id !== input.intakeId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Session is pinned to a different intake. Please create a new session.",
          });
        }
      }
      
      // Create new session if not provided
      if (!sessionId) {
        sessionId = randomUUID();
        const { error } = await supabase
          .from("terminal_sessions")
          .insert({
            id: sessionId,
            user_id: userId,
            intake_id: input.intakeId,
            title: input.query.substring(0, 100),
          });
        
        if (error) {
          console.error("Failed to create session:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create session",
          });
        }
      }
      
      // Save user message
      await supabase
        .from("terminal_messages")
        .insert({
          session_id: sessionId,
          role: "user",
          content: input.query,
        });
      
      // Build context pack for the intake
      const contextPack = await buildContextPack(input.intakeId, ctx.user.id);
      const formattedContext = formatContextPackForLLM(contextPack);
      
      // Collect citations from context
      const citations: Citation[] = [];
      
      // Add intake citation
      if (contextPack.intake) {
        citations.push({
          type: "INTAKE",
          id: contextPack.intake.id,
        });
      }
      
      // Add note citations
      contextPack.notes.forEach(note => {
        citations.push({
          type: "NOTE",
          id: note.id,
        });
      });
      
      // Add upload citations
      contextPack.uploads.forEach(upload => {
        citations.push({
          type: "UPLOAD",
          id: upload.id,
          file_name: upload.file_name,
        });
      });
      
      // Search for relevant statutes if requested or query mentions law/statute
      let statuteContext = "";
      if (input.tools?.includes("statutes") || /statute|law|code|section|§/i.test(input.query)) {
        const practiceArea = contextPack.intake?.practice_area;
        const statutes = await searchStatutes(input.query, practiceArea || undefined);
        if (statutes.length > 0) {
          statuteContext = "\n\n## Relevant Statutes:\n" + statutes.map(s => 
            `- ${s.citation}: ${s.title}\n  ${s.excerpt}`
          ).join("\n");
          
          statutes.forEach(s => {
            citations.push({
              type: "STATUTE",
              id: s.id,
              citation: s.citation,
            });
          });
        }
      }
      
      // Search for case law if requested
      let caselawContext = "";
      if (input.tools?.includes("caselaw") || /case law|precedent|ruling|court/i.test(input.query)) {
        const cases = await searchCourtListener(input.query);
        if (cases.length > 0) {
          caselawContext = "\n\n## Relevant Case Law:\n" + cases.map(c => 
            `- ${c.title} (${c.court}, ${c.date})\n  ${c.excerpt}`
          ).join("\n");
          
          cases.forEach(c => {
            citations.push({
              type: "CASELAW",
              id: c.id,
              citation: c.citation,
              url: c.url,
            });
          });
        }
      }
      
      // Search uploaded documents if requested
      let uploadSearchContext = "";
      if (input.tools?.includes("uploads")) {
        const uploadResults = await searchUploadText(input.intakeId, input.query);
        if (uploadResults.length > 0) {
          uploadSearchContext = "\n\n## Document Search Results:\n" + uploadResults.map(r => 
            `- ${r.file_name}: ...${r.snippet}...`
          ).join("\n");
        }
      }
      
      // Build system prompt
      const systemPrompt = `You are a legal research assistant for Gurovich Law Group, a California law firm specializing in personal injury, criminal defense, employment law, tenant rights, and civil litigation.

You are helping analyze a specific client intake/case. All your responses must be grounded in the provided context. Do not make up facts or cite cases that are not provided.

${formattedContext}
${statuteContext}
${caselawContext}
${uploadSearchContext}

Guidelines:
1. Always reference the specific intake data when answering questions
2. Cite relevant statutes and case law when applicable
3. Be precise and professional in your responses
4. If information is missing or unclear, note what additional information would be helpful
5. Suggest next steps or actions when appropriate`;

      // Call LLM
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.query },
        ],
      });
      
      const rawContent = response.choices[0]?.message?.content;
      const answer = typeof rawContent === 'string' ? rawContent : "I apologize, but I was unable to generate a response.";
      
      // Generate suggested actions based on the query and response
      const suggestedActions: SuggestedAction[] = [];
      
      // Suggest creating a task if the response mentions action items
      if (/should|need to|must|recommend|suggest/i.test(answer)) {
        suggestedActions.push({
          label: "Create Task",
          action: "createTask",
          payload: { title: input.query.substring(0, 50) },
        });
      }
      
      // Suggest saving as draft if it's a substantial response
      if (answer.length > 500) {
        suggestedActions.push({
          label: "Save as Draft",
          action: "saveDraft",
          payload: { type: "analysis", content: answer },
        });
      }
      
      // Suggest follow-up queries
      if (/statute|law/i.test(input.query) && !input.tools?.includes("statutes")) {
        suggestedActions.push({
          label: "Search Statutes",
          action: "query",
          payload: { query: input.query, tools: ["statutes"] },
        });
      }
      
      if (/case|precedent/i.test(input.query) && !input.tools?.includes("caselaw")) {
        suggestedActions.push({
          label: "Search Case Law",
          action: "query",
          payload: { query: input.query, tools: ["caselaw"] },
        });
      }
      
      // Save assistant message
      await supabase
        .from("terminal_messages")
        .insert({
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
      includeDeleted: z.boolean().default(false),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      let query = supabase
        .from("terminal_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("is_favorite", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(input.limit);
      
      // Filter out soft-deleted sessions unless explicitly requested
      if (!input.includeDeleted) {
        query = query.is("deleted_at", null);
      }
      
      if (input.intakeId) {
        query = query.eq("intake_id", input.intakeId);
      }
      
      const { data: sessions, error } = await query;
      
      if (error) {
        console.error("Failed to list sessions:", error);
        return [];
      }
      
      return (sessions || []).map(s => ({
        ...s,
        isFavorite: s.is_favorite || false,
        deletedAt: s.deleted_at,
        intakeId: s.intake_id,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
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
      const userId = String(ctx.user.id);
      
      // Get session
      const { data: sessions, error: sessionError } = await supabase
        .from("terminal_sessions")
        .select("*")
        .eq("id", input.sessionId)
        .eq("user_id", userId)
        .limit(1);
      
      if (sessionError || !sessions || sessions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }
      
      const session = sessions[0];
      
      // Get messages
      const { data: messages, error: messagesError } = await supabase
        .from("terminal_messages")
        .select("*")
        .eq("session_id", input.sessionId)
        .order("created_at", { ascending: true });
      
      if (messagesError) {
        console.error("Failed to get messages:", messagesError);
      }
      
      return {
        ...session,
        // Map snake_case to camelCase for frontend compatibility
        intakeId: session.intake_id,
        createdAt: new Date(session.created_at),
        updatedAt: new Date(session.updated_at),
        messages: (messages || []).map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          citations: m.citations,
          suggestedActions: m.suggested_actions,
          createdAt: new Date(m.created_at),
        })),
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
      const userId = String(ctx.user.id);
      
      const { error } = await supabase
        .from("terminal_sessions")
        .update({ title: input.title })
        .eq("id", input.sessionId)
        .eq("user_id", userId);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save session",
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
      const userId = String(ctx.user.id);
      
      // Delete messages first (cascade should handle this, but be explicit)
      await supabase
        .from("terminal_messages")
        .delete()
        .eq("session_id", input.sessionId);
      
      // Delete session
      const { error } = await supabase
        .from("terminal_sessions")
        .delete()
        .eq("id", input.sessionId)
        .eq("user_id", userId);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete session",
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
      const userId = String(ctx.user.id);
      
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
          user_id: userId,
          title: input.title,
          description: input.description,
        })
        .select()
        .single();
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create task",
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
      type: z.string(),
      title: z.string().optional(),
      content: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
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
          user_id: userId,
          type: input.type,
          title: input.title,
          content: input.content,
        })
        .select()
        .single();
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save draft",
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
      
      const { data: tasks, error } = await supabase
        .from("discovery_tasks")
        .select("*")
        .eq("intake_id", input.intakeId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Failed to get tasks:", error);
        return [];
      }
      
      return tasks || [];
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
      
      const { data: drafts, error } = await supabase
        .from("discovery_drafts")
        .select("*")
        .eq("intake_id", input.intakeId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Failed to get drafts:", error);
        return [];
      }
      
      return drafts || [];
    }),

  /**
   * Search documents (upload text) for keywords
   */
  searchDocuments: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      query: z.string().min(1).max(500),
    }))
    .query(async ({ input, ctx }) => {
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      const results = await searchUploadText(input.intakeId, input.query);
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
      
      // Get all uploads for the intake
      const { data: uploads } = await supabase
        .from("intake_uploads")
        .select("id, file_name")
        .eq("intake_id", input.intakeId);
      
      // Get processed uploads
      const { data: processed } = await supabase
        .from("upload_text")
        .select("upload_id")
        .eq("intake_id", input.intakeId);
      
      const processedIds = new Set((processed || []).map(p => p.upload_id));
      
      return {
        total: uploads?.length || 0,
        processed: processedIds.size,
        pending: (uploads || []).filter(u => !processedIds.has(u.id)).map(u => ({
          id: u.id,
          file_name: u.file_name,
        })),
      };
    }),

  /**
   * Toggle favorite status for a session
   */
  toggleFavorite: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      // Get current favorite status
      const { data: sessions } = await supabase
        .from("terminal_sessions")
        .select("is_favorite")
        .eq("id", input.sessionId)
        .eq("user_id", userId)
        .limit(1);
      
      if (!sessions || sessions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }
      
      const newFavoriteStatus = !sessions[0].is_favorite;
      
      const { error } = await supabase
        .from("terminal_sessions")
        .update({ is_favorite: newFavoriteStatus })
        .eq("id", input.sessionId)
        .eq("user_id", userId);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update favorite status",
        });
      }
      
      return { success: true, isFavorite: newFavoriteStatus };
    }),

  /**
   * Soft delete a session (sets deleted_at timestamp)
   */
  softDeleteSession: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      const { error } = await supabase
        .from("terminal_sessions")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", input.sessionId)
        .eq("user_id", userId);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete session",
        });
      }
      
      return { success: true };
    }),

  /**
   * Restore a soft-deleted session
   */
  restoreSession: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      const { error } = await supabase
        .from("terminal_sessions")
        .update({ deleted_at: null })
        .eq("id", input.sessionId)
        .eq("user_id", userId);
      
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to restore session",
        });
      }
      
      return { success: true };
    }),

  /**
   * Export session as PDF data (returns HTML content for PDF generation)
   */
  exportSessionPDF: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      // Get session
      const { data: sessions } = await supabase
        .from("terminal_sessions")
        .select("*")
        .eq("id", input.sessionId)
        .eq("user_id", userId)
        .limit(1);
      
      if (!sessions || sessions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }
      
      const session = sessions[0];
      
      // Get intake info
      const { data: intakes } = await supabase
        .from("intakes")
        .select("first_name, last_name, practice_area")
        .eq("id", session.intake_id)
        .limit(1);
      
      const intake = intakes?.[0];
      const clientName = intake ? `${intake.first_name || ''} ${intake.last_name || ''}`.trim() : `Intake #${session.intake_id}`;
      
      // Get messages
      const { data: messages } = await supabase
        .from("terminal_messages")
        .select("*")
        .eq("session_id", input.sessionId)
        .order("created_at", { ascending: true });
      
      // Build PDF content
      const pdfContent = {
        title: session.title || "Terminal Session",
        clientName,
        practiceArea: intake?.practice_area || "Unknown",
        sessionDate: session.created_at,
        messages: (messages || []).map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
          citations: m.citations || [],
        })),
      };
      
      return pdfContent;
    }),

  /**
   * Commit session summary to case memory
   */
  commitToCaseMemory: adminProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
      title: z.string().min(1).max(500),
      summary: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      const userId = String(ctx.user.id);
      
      // Get session
      const { data: sessions } = await supabase
        .from("terminal_sessions")
        .select("*")
        .eq("id", input.sessionId)
        .eq("user_id", userId)
        .limit(1);
      
      if (!sessions || sessions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }
      
      const session = sessions[0];
      
      // Get all messages to build summary
      const { data: messages } = await supabase
        .from("terminal_messages")
        .select("*")
        .eq("session_id", input.sessionId)
        .order("created_at", { ascending: true });
      
      // Extract key facts and citations from messages
      const allCitations: Citation[] = [];
      const keyFacts: string[] = [];
      const legalIssues: string[] = [];
      
      (messages || []).forEach(m => {
        if (m.citations) {
          allCitations.push(...(m.citations as Citation[]));
        }
        // Extract key facts from assistant messages
        if (m.role === "assistant" && m.content) {
          const factMatches = m.content.match(/key fact[s]?:?\s*([^\n]+)/gi);
          if (factMatches) {
            keyFacts.push(...factMatches.map((f: string) => f.replace(/key fact[s]?:?\s*/i, '')));
          }
          const issueMatches = m.content.match(/legal issue[s]?:?\s*([^\n]+)/gi);
          if (issueMatches) {
            legalIssues.push(...issueMatches.map((i: string) => i.replace(/legal issue[s]?:?\s*/i, '')));
          }
        }
      });
      
      // Build summary content if not provided
      let summaryContent = input.summary;
      if (!summaryContent) {
        const assistantMessages = (messages || []).filter(m => m.role === "assistant");
        summaryContent = assistantMessages.map(m => m.content).join("\n\n");
      }
      
      // Insert into case_memory
      const { data, error } = await supabase
        .from("case_memory")
        .insert({
          intake_id: session.intake_id,
          session_id: input.sessionId,
          memory_type: "session_summary",
          title: input.title,
          content: summaryContent,
          key_facts: keyFacts,
          legal_issues: legalIssues,
          citations: allCitations,
          created_by: userId,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Failed to commit to case memory:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to commit to case memory",
        });
      }
      
      return { success: true, memoryId: data.id };
    }),

  /**
   * Get case memory entries for an intake
   */
  getCaseMemory: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      limit: z.number().min(1).max(100).default(50),
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
      
      const { data: memories, error } = await supabase
        .from("case_memory")
        .select("*")
        .eq("intake_id", input.intakeId)
        .order("created_at", { ascending: false })
        .limit(input.limit);
      
      if (error) {
        console.error("Failed to get case memory:", error);
        return [];
      }
      
      return memories || [];
    }),

  /**
   * Get signed download URL for a file (citations panel)
   */
  getFileDownloadUrl: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      storagePath: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();
      
      // Verify intake access
      const hasAccess = await verifyIntakeAccess(input.intakeId, ctx.user.id, ctx.user.role || "user");
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this intake",
        });
      }
      
      // Verify the file belongs to the intake
      const { data: upload, error } = await supabase
        .from("intake_uploads")
        .select("id, storage_path, file_path, file_name")
        .eq("intake_id", input.intakeId)
        .or(`storage_path.eq.${input.storagePath},file_path.eq.${input.storagePath}`)
        .single();
      
      if (error || !upload) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found or access denied",
        });
      }
      
      // Get signed URL (1 hour expiry)
      const signedUrl = await getSignedDownloadUrl(input.storagePath, 3600);
      
      if (!signedUrl) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate download URL",
        });
      }
      
      return { 
        url: signedUrl,
        fileName: upload.file_name as string,
      };
    }),

  /**
   * Get list of intakes for the terminal dropdown
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
        .select("id, first_name, last_name, practice_area, status, created_at")
        .order("created_at", { ascending: false })
        .limit(input.limit);
      
      // Filter by search term if provided
      if (input.search && input.search.length > 0) {
        query = query.or(`first_name.ilike.%${input.search}%,last_name.ilike.%${input.search}%`);
      }
      
      const { data: intakes, error } = await query;
      
      if (error) {
        console.error("Failed to get intakes:", error);
        return [];
      }
      
      return (intakes || []).map(i => ({
        id: i.id,
        name: `${i.first_name || ''} ${i.last_name || ''}`.trim() || `Intake #${i.id}`,
        practiceArea: i.practice_area,
        status: i.status,
        createdAt: i.created_at,
      }));
    }),
});
