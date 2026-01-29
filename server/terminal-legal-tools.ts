/**
 * Legal Research Tools for Terminal RAG
 * 
 * Provides statute search and case law lookup via CourtListener API v4.
 * 
 * CourtListener API Documentation:
 * - Base URL: https://www.courtlistener.com/api/rest/v4/
 * - Search endpoint: /api/rest/v4/search/?type=o (for opinions)
 * - No authentication required for basic searches (5,000 queries/hour limit)
 * - Returns case law with citations, court info, and text snippets
 */

import { getSupabaseAdmin } from "./supabase";
import type { StatuteSearchResult, CaselawSearchResult } from "./terminal-types";

// CourtListener API base URL
const COURTLISTENER_API_URL = "https://www.courtlistener.com/api/rest/v4";

// California court IDs for filtering
const CALIFORNIA_COURTS = [
  "cal",      // California Supreme Court
  "calctapp", // California Court of Appeal
  "cacd",     // Central District of California
  "caed",     // Eastern District of California
  "cand",     // Northern District of California
  "casd",     // Southern District of California
  "ca9",      // Ninth Circuit Court of Appeals
];

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
  
  // Execute query
  const { data, error } = await queryBuilder.limit(limit * 3); // Get more to filter
  
  if (error || !data) {
    console.error("Statute search error:", error);
    return [];
  }
  
  // Score results by keyword matching
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  
  // Also check tags if provided
  const tagSet = new Set(tags?.map(t => t.toLowerCase()) || []);
  
  const scoredResults = data.map(statute => {
    const searchText = `${statute.title} ${statute.text_content}`.toLowerCase();
    const statuteTags = (statute.tags || "").toLowerCase().split(",").map((t: string) => t.trim());
    let score = 0;
    
    // Score by keyword matches
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        score += (searchText.split(keyword).length - 1) * 2;
      }
    }
    
    // Score by tag matches
    for (const tag of statuteTags) {
      if (tagSet.has(tag)) {
        score += 5; // Tag match is worth more
      }
    }
    
    // If no query but tags provided, score by tag presence
    if (query.length === 0 && tags && tags.length > 0) {
      for (const tag of statuteTags) {
        if (tagSet.has(tag)) {
          score += 10;
        }
      }
    }
    
    return {
      ...statute,
      score,
    };
  });
  
  // Sort by score and take top results
  const topResults = scoredResults
    .filter(r => r.score > 0 || (query.length === 0 && tags && tags.length > 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  // Format results
  return topResults.map(r => ({
    id: r.id,
    citation: `${r.jurisdiction} ${r.code} § ${r.section}`,
    title: r.title,
    excerpt: r.text_content.substring(0, 300) + (r.text_content.length > 300 ? "..." : ""),
    jurisdiction: r.jurisdiction,
    tags: r.tags ? r.tags.split(",").map((t: string) => t.trim()) : [],
  }));
}

/**
 * Search CourtListener for case law using API v4
 * 
 * API Documentation: https://www.courtlistener.com/help/api/rest/search/
 * - type=o for opinions (case law)
 * - Returns caseName, citation, court, dateFiled, snippet
 * - Supports court filtering and date ranges
 */
export async function searchCourtListener(
  query: string,
  court?: string,
  dateRange?: { start?: string; end?: string },
  limit: number = 10
): Promise<CaselawSearchResult[]> {
  try {
    // Build search URL with proper v4 parameters
    const params = new URLSearchParams();
    
    // Add query - use caseName field for better results
    params.append("q", query);
    
    // Set type to opinions (case law)
    params.append("type", "o");
    
    // Order by relevance score
    params.append("order_by", "score desc");
    
    // Add court filter if provided
    if (court) {
      // Map common court names to CourtListener IDs
      const courtId = mapCourtToId(court);
      if (courtId) {
        params.append("court", courtId);
      }
    }
    
    // Add date range filters using proper field names
    if (dateRange?.start) {
      params.append("filed_after", dateRange.start);
    }
    if (dateRange?.end) {
      params.append("filed_before", dateRange.end);
    }
    
    const url = `${COURTLISTENER_API_URL}/search/?${params.toString()}`;
    console.log("CourtListener search URL:", url);
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Gurovich-Law-Group-Terminal/1.0",
      },
    });
    
    if (!response.ok) {
      console.error("CourtListener API error:", response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      console.log("No results from CourtListener");
      return [];
    }
    
    // Map results to our format based on v4 response structure
    return data.results.slice(0, limit).map((result: any) => ({
      id: result.cluster_id?.toString() || result.id?.toString() || "",
      title: result.caseName || result.caseNameFull || "Unknown Case",
      court: result.court || mapCourtIdToName(result.court_id) || "Unknown Court",
      date: result.dateFiled || "",
      citation: formatCitation(result.citation) || result.caseName || "No citation",
      excerpt: cleanSnippet(result.opinions?.[0]?.snippet || result.snippet || ""),
      url: result.absolute_url 
        ? `https://www.courtlistener.com${result.absolute_url}`
        : `https://www.courtlistener.com/opinion/${result.cluster_id || result.id}/`,
      citeCount: result.citeCount || 0,
      status: result.status || "",
    }));
  } catch (error) {
    console.error("CourtListener search error:", error);
    return [];
  }
}

/**
 * Search California-specific case law
 */
export async function searchCaliforniaCaselaw(
  query: string,
  dateRange?: { start?: string; end?: string },
  limit: number = 10
): Promise<CaselawSearchResult[]> {
  // Search across California courts
  const results: CaselawSearchResult[] = [];
  
  // Search California state courts first
  const stateResults = await searchCourtListener(
    query + " court:cal OR court:calctapp",
    undefined,
    dateRange,
    limit
  );
  results.push(...stateResults);
  
  // If we need more results, search federal courts in California
  if (results.length < limit) {
    const federalResults = await searchCourtListener(
      query + " court:ca9 OR court:cacd OR court:cand OR court:casd OR court:caed",
      undefined,
      dateRange,
      limit - results.length
    );
    results.push(...federalResults);
  }
  
  return results.slice(0, limit);
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
    tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
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
    personal_injury: ["personal_injury", "tort", "negligence", "wrongful_death", "auto_accident"],
    criminal_defense: ["criminal", "homicide", "assault", "theft", "sentencing"],
    employment_law: ["employment", "wages", "discrimination", "whistleblower", "retaliation"],
    tenant_rights: ["tenant_rights", "habitability", "eviction", "security_deposit", "rent_control"],
    civil_litigation: ["civil_litigation", "statute_of_limitations", "discovery", "anti_slapp"],
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

// Helper functions

/**
 * Map common court names to CourtListener court IDs
 */
function mapCourtToId(court: string): string | null {
  const courtMap: Record<string, string> = {
    // California State Courts
    "california supreme court": "cal",
    "cal supreme": "cal",
    "california court of appeal": "calctapp",
    "cal court of appeal": "calctapp",
    
    // Federal Courts - California
    "ninth circuit": "ca9",
    "9th circuit": "ca9",
    "central district california": "cacd",
    "northern district california": "cand",
    "southern district california": "casd",
    "eastern district california": "caed",
    
    // US Supreme Court
    "supreme court": "scotus",
    "us supreme court": "scotus",
    "scotus": "scotus",
  };
  
  const normalized = court.toLowerCase().trim();
  return courtMap[normalized] || null;
}

/**
 * Map CourtListener court ID to human-readable name
 */
function mapCourtIdToName(courtId: string): string {
  const courtNames: Record<string, string> = {
    "cal": "California Supreme Court",
    "calctapp": "California Court of Appeal",
    "ca9": "Ninth Circuit Court of Appeals",
    "cacd": "Central District of California",
    "cand": "Northern District of California",
    "casd": "Southern District of California",
    "caed": "Eastern District of California",
    "scotus": "U.S. Supreme Court",
    "hawapp": "Hawaii Intermediate Court of Appeals",
  };
  
  return courtNames[courtId] || courtId;
}

/**
 * Format citation array from CourtListener
 */
function formatCitation(citations: string[] | undefined): string {
  if (!citations || citations.length === 0) {
    return "";
  }
  return citations[0]; // Return the first/primary citation
}

/**
 * Clean up snippet text from CourtListener
 */
function cleanSnippet(snippet: string): string {
  if (!snippet) return "";
  
  // Remove HTML tags if any
  let clean = snippet.replace(/<[^>]*>/g, "");
  
  // Normalize whitespace
  clean = clean.replace(/\s+/g, " ").trim();
  
  // Truncate if too long
  if (clean.length > 400) {
    clean = clean.substring(0, 400) + "...";
  }
  
  return clean;
}
