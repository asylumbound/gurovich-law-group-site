import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getSupabaseAdmin } from "./supabase";
import { TRPCError } from "@trpc/server";

// Status enum for intakes
const intakeStatusSchema = z.enum(["draft", "submitted", "reviewed", "contacted", "converted", "closed"]);

// Admin-only procedure that checks for admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Get all intakes with filtering and pagination
  getIntakes: adminProcedure
    .input(z.object({
      status: intakeStatusSchema.optional(),
      practice_area: z.string().optional(),
      urgency: z.enum(["emergency", "high", "normal", "unsure"]).optional(),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      sortBy: z.enum(["created_at", "updated_at", "urgency", "first_name"]).default("created_at"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }))
    .query(async ({ input }) => {
      const supabase = getSupabaseAdmin();
      const offset = (input.page - 1) * input.limit;

      // Build query
      let query = supabase
        .from("intakes")
        .select(`
          id,
          first_name,
          last_name,
          phone,
          email,
          city,
          state,
          practice_area,
          issue_type_id,
          urgency,
          summary,
          status,
          created_at,
          updated_at,
          preferred_contact_method,
          preferred_language
        `, { count: "exact" });

      // Apply filters
      if (input.status) {
        query = query.eq("status", input.status);
      } else {
        // By default, exclude drafts
        query = query.neq("status", "draft");
      }

      if (input.practice_area) {
        query = query.eq("practice_area", input.practice_area);
      }

      if (input.urgency) {
        query = query.eq("urgency", input.urgency);
      }

      if (input.search) {
        query = query.or(`first_name.ilike.%${input.search}%,last_name.ilike.%${input.search}%,email.ilike.%${input.search}%,phone.ilike.%${input.search}%`);
      }

      // Apply sorting and pagination
      query = query
        .order(input.sortBy, { ascending: input.sortOrder === "asc" })
        .range(offset, offset + input.limit - 1);

      const { data, error, count } = await query;

      if (error) throw new Error(error.message);

      // Get issue type names
      const issueTypeIds = Array.from(new Set(data?.map(i => i.issue_type_id).filter(Boolean)));
      let issueTypes: Record<number, string> = {};
      
      if (issueTypeIds.length > 0) {
        const { data: issueTypeData } = await supabase
          .from("issue_types")
          .select("id, name")
          .in("id", issueTypeIds);
        
        if (issueTypeData) {
          issueTypes = Object.fromEntries(issueTypeData.map(it => [it.id, it.name]));
        }
      }

      // Enrich data with issue type names
      const enrichedData = data?.map(intake => ({
        ...intake,
        issue_type_name: intake.issue_type_id ? issueTypes[intake.issue_type_id] : null,
      }));

      return {
        intakes: enrichedData || [],
        total: count || 0,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil((count || 0) / input.limit),
      };
    }),

  // Get single intake with all details
  getIntake: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const supabase = getSupabaseAdmin();

      // Get main intake data
      const { data: intake, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) throw new Error(error.message);
      if (!intake) throw new Error("Intake not found");

      // Get issue type
      let issueType = null;
      if (intake.issue_type_id) {
        const { data } = await supabase
          .from("issue_types")
          .select("*")
          .eq("id", intake.issue_type_id)
          .single();
        issueType = data;
      }

      // Get parties
      const { data: parties } = await supabase
        .from("intake_parties")
        .select("*")
        .eq("intake_id", input.id);

      // Get uploads
      const { data: uploads } = await supabase
        .from("intake_uploads")
        .select("*")
        .eq("intake_id", input.id);

      // Get practice-specific details
      let practiceDetails = null;
      const detailsTableMap: Record<string, string> = {
        personal_injury: "intake_pi_details",
        criminal_defense: "intake_criminal_details",
        employment_law: "intake_employment_details",
        tenant_rights: "intake_tenant_details",
        civil_litigation: "intake_civil_details",
      };

      if (intake.practice_area && detailsTableMap[intake.practice_area]) {
        const { data } = await supabase
          .from(detailsTableMap[intake.practice_area])
          .select("*")
          .eq("intake_id", input.id)
          .single();
        practiceDetails = data;
      }

      return {
        ...intake,
        issue_type: issueType,
        parties: parties || [],
        uploads: uploads || [],
        practice_details: practiceDetails,
      };
    }),

  // Update intake status
  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: intakeStatusSchema,
    }))
    .mutation(async ({ input }) => {
      const supabase = getSupabaseAdmin();

      const { error } = await supabase
        .from("intakes")
        .update({ status: input.status })
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Add note to intake
  addNote: adminProcedure
    .input(z.object({
      intakeId: z.number(),
      note: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabaseAdmin();

      // Get current notes
      const { data: intake } = await supabase
        .from("intakes")
        .select("admin_notes")
        .eq("id", input.intakeId)
        .single();

      const timestamp = new Date().toISOString();
      const newNote = `[${timestamp}] ${ctx.user.name || ctx.user.email || "Admin"}: ${input.note}`;
      const updatedNotes = intake?.admin_notes 
        ? `${intake.admin_notes}\n\n${newNote}`
        : newNote;

      const { error } = await supabase
        .from("intakes")
        .update({ admin_notes: updatedNotes })
        .eq("id", input.intakeId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Get dashboard stats
  getStats: adminProcedure.query(async () => {
    const supabase = getSupabaseAdmin();

    // Get counts by status
    const { data: statusCounts } = await supabase
      .from("intakes")
      .select("status")
      .neq("status", "draft");

    const stats = {
      total: 0,
      submitted: 0,
      reviewed: 0,
      contacted: 0,
      converted: 0,
      closed: 0,
      byUrgency: {
        emergency: 0,
        high: 0,
        normal: 0,
        unsure: 0,
      },
      byPracticeArea: {} as Record<string, number>,
    };

    if (statusCounts) {
      stats.total = statusCounts.length;
      statusCounts.forEach(row => {
        if (row.status && stats[row.status as keyof typeof stats] !== undefined) {
          (stats as any)[row.status]++;
        }
      });
    }

    // Get urgency breakdown for non-draft intakes
    const { data: urgencyCounts } = await supabase
      .from("intakes")
      .select("urgency")
      .neq("status", "draft");

    if (urgencyCounts) {
      urgencyCounts.forEach(row => {
        if (row.urgency && stats.byUrgency[row.urgency as keyof typeof stats.byUrgency] !== undefined) {
          stats.byUrgency[row.urgency as keyof typeof stats.byUrgency]++;
        }
      });
    }

    // Get practice area breakdown
    const { data: areaCounts } = await supabase
      .from("intakes")
      .select("practice_area")
      .neq("status", "draft");

    if (areaCounts) {
      areaCounts.forEach(row => {
        if (row.practice_area) {
          stats.byPracticeArea[row.practice_area] = (stats.byPracticeArea[row.practice_area] || 0) + 1;
        }
      });
    }

    return stats;
  }),
});
