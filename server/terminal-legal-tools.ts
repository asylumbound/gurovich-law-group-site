/**
 * Legal Research Tools for Terminal RAG
 * 
 * Provides statute search and case law lookup via CourtListener API.
 */

import { getSupabaseAdmin } from "./supabase";
import type { StatuteSearchResult, CaselawSearchResult } from "./terminal-types";

// CourtListener API base URL
const COURTLISTENER_API_URL = "https://www.courtlistener.com/api/rest/v4";

/**
 * Search local statutes database
 */
export async function searchStatutes(
  query: string,
  jurisdiction?: string,
  tags?: string[],
  limit: number = 10
): Promise<StatuteSearchResult[]> {
  const supabase = getSupabaseAdmin();
  
  // Build search query
  let queryBuilder = supabase
    .from("statutes")
    .select("id, jurisdiction, code, section, title, text_content, tags");
  
  // Filter by jurisdiction if provided
  if (jurisdiction) {
    queryBuilder = queryBuilder.eq("jurisdiction", jurisdiction);
  }
  
  // Filter by tags if provided
  if (tags && tags.length > 0) {
    queryBuilder = queryBuilder.overlaps("tags", tags);
  }
  
  // Execute query
  const { data, error } = await queryBuilder.limit(limit * 2); // Get more to filter
  
  if (error || !data) {
    console.error("Statute search error:", error);
    return [];
  }
  
  // Score results by keyword matching
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  
  const scoredResults = data.map(statute => {
    const searchText = `${statute.title} ${statute.text_content}`.toLowerCase();
    let score = 0;
    
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        score += (searchText.split(keyword).length - 1);
      }
    }
    
    return {
      ...statute,
      score,
    };
  });
  
  // Sort by score and take top results
  const topResults = scoredResults
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  // Format results
  return topResults.map(r => ({
    id: r.id,
    citation: `${r.jurisdiction} ${r.code} § ${r.section}`,
    title: r.title,
    excerpt: r.text_content.substring(0, 300) + (r.text_content.length > 300 ? "..." : ""),
    jurisdiction: r.jurisdiction,
    tags: r.tags,
  }));
}

/**
 * Search CourtListener for case law
 * Uses the public API (no authentication required for basic searches)
 */
export async function searchCourtListener(
  query: string,
  court?: string,
  dateRange?: { start?: string; end?: string },
  limit: number = 10
): Promise<CaselawSearchResult[]> {
  try {
    // Build search URL
    const params = new URLSearchParams({
      q: query,
      order_by: "score desc",
      page_size: limit.toString(),
    });
    
    // Add court filter if provided
    if (court) {
      params.append("court", court);
    }
    
    // Add date range if provided
    if (dateRange?.start) {
      params.append("filed_after", dateRange.start);
    }
    if (dateRange?.end) {
      params.append("filed_before", dateRange.end);
    }
    
    const response = await fetch(
      `${COURTLISTENER_API_URL}/search/?${params.toString()}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("CourtListener API error:", response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    // Map results to our format
    return data.results.map((result: any) => ({
      id: result.id?.toString() || result.cluster_id?.toString() || "",
      title: result.caseName || result.case_name || "Unknown Case",
      court: result.court || result.court_id || "Unknown Court",
      date: result.dateFiled || result.date_filed || "",
      citation: result.citation?.[0] || result.caseName || "No citation",
      excerpt: result.snippet || result.text?.substring(0, 300) || "",
      url: result.absolute_url 
        ? `https://www.courtlistener.com${result.absolute_url}`
        : `https://www.courtlistener.com/opinion/${result.id}/`,
    }));
  } catch (error) {
    console.error("CourtListener search error:", error);
    return [];
  }
}

/**
 * Get statute by ID
 */
export async function getStatuteById(id: number): Promise<StatuteSearchResult | null> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from("statutes")
    .select("id, jurisdiction, code, section, title, text_content, tags")
    .eq("id", id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.id,
    citation: `${data.jurisdiction} ${data.code} § ${data.section}`,
    title: data.title,
    excerpt: data.text_content,
    jurisdiction: data.jurisdiction,
    tags: data.tags,
  };
}

/**
 * Get California-specific statutes by practice area
 */
export async function getStatutesByPracticeArea(
  practiceArea: string,
  limit: number = 5
): Promise<StatuteSearchResult[]> {
  const tagMap: Record<string, string[]> = {
    personal_injury: ["personal_injury", "tort", "negligence"],
    criminal_defense: ["criminal", "penal"],
    employment_law: ["employment", "labor", "whistleblower"],
    tenant_rights: ["tenant_rights", "landlord_tenant", "housing"],
    civil_litigation: ["civil", "contract", "breach"],
  };
  
  const tags = tagMap[practiceArea] || [];
  
  if (tags.length === 0) {
    return [];
  }
  
  return searchStatutes("", "CA", tags, limit);
}

/**
 * Format statute citation for display
 */
export function formatStatuteCitation(statute: StatuteSearchResult): string {
  return `${statute.citation} - ${statute.title}`;
}

/**
 * Format case law citation for display
 */
export function formatCaselawCitation(caselaw: CaselawSearchResult): string {
  const year = caselaw.date ? new Date(caselaw.date).getFullYear() : "";
  return `${caselaw.title}${year ? ` (${year})` : ""}`;
}
