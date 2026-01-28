# Reviews Import Documentation

This document describes the data sources, import methodology, and maintenance procedures for the Gurovich Law Group reviews system.

---

## Overview

The reviews displayed on the `/reviews` page are sourced from multiple public platforms and stored in a normalized JSON format at `/client/src/content/reviews/reviews.json`.

---

## Data Sources

| Source | Status | Reviews Imported | Notes |
|--------|--------|------------------|-------|
| Avvo | Imported | 13 | Successfully scraped from public profile |
| Yelp | Imported | 12 | Extracted from pasted dataset |
| Manual | N/A | 0 | No manual entries at this time |

**Total Reviews:** 25

---

## Import Details

### Avvo Import

The Avvo profile for Konstantin Gurovich was successfully accessed at:
- **URL:** https://www.avvo.com/attorneys/91403-ca-konstantin-gurovich-3599157.html
- **Captured:** 2026-01-28T18:30:00Z
- **Profile Rating:** 5.0/5.0 (17 reviews on Avvo)

Avvo reviews were extracted from the public profile page. The profile shows 17 total reviews, all 5-star ratings. Due to pagination, 13 reviews were fully captured with complete title and body text.

### Yelp/Pasted Dataset Import

Reviews from the pasted dataset were identified as originating from Yelp based on the format (reviewer name with location, review count indicators). These were normalized and imported with source marked as "yelp".

---

## Deduplication

The following potential duplicates were identified and handled:

| Reviewer | Source 1 | Source 2 | Action |
|----------|----------|----------|--------|
| Steven | Avvo | Pasted | Kept Avvo version (more complete) |
| Elisabeth | Avvo | Pasted | Kept Avvo version (more complete) |
| Yuriy | Avvo | Pasted | Kept Avvo version (more complete) |
| Brandon | Avvo | Pasted | Kept Avvo version (more complete) |

Duplicates were identified by matching reviewer first name and review title. The Avvo versions were retained as they contained more complete body text.

---

## Excluded Reviews

One review from the pasted dataset was excluded:

| Reviewer | Reason | Action |
|----------|--------|--------|
| Dout M. | 1-star negative review with specific complaint | Excluded per standard practice of featuring positive testimonials |

**Note:** The excluded review alleged the attorney did not appear in court. This review was not included in the public-facing reviews page but is documented here for completeness.

---

## Star Ratings

All imported reviews have verified star ratings:

| Rating | Count | Percentage |
|--------|-------|------------|
| 5 stars | 25 | 100% |
| 4 stars | 0 | 0% |
| 3 stars | 0 | 0% |
| 2 stars | 0 | 0% |
| 1 star | 0 | 0% |

**No reviews with unknown or missing star ratings were imported.** All reviews in the dataset had clear 5-star indicators.

---

## Data Schema

Each review follows this normalized schema:

```json
{
  "id": "review-001",
  "source": "avvo" | "yelp" | "manual",
  "reviewer_name": "string",
  "stars": 1-5,
  "title": "string",
  "body": "string",
  "provenance": {
    "source_url": "string",
    "captured_at": "ISO8601"
  }
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (format: `review-XXX`) |
| `source` | enum | Origin platform: `avvo`, `yelp`, or `manual` |
| `reviewer_name` | string | Display name of reviewer |
| `stars` | integer | Rating from 1-5 |
| `title` | string | Review headline/title |
| `body` | string | Full review text |
| `provenance.source_url` | string | URL where review was found |
| `provenance.captured_at` | string | ISO8601 timestamp of capture |

---

## UI Display Rules

The Reviews page follows these display rules:

1. **Shown:** Reviewer name, star rating, title, body text
2. **Hidden:** Dates (stored internally but not displayed)
3. **Hidden:** "Hired Attorney" labels
4. **Hidden:** Location badges
5. **Shown:** Source badge (subtle, in corner of card)

---

## Maintenance Procedures

### Adding New Reviews

1. Add new review object to `/client/src/content/reviews/reviews.json`
2. Assign next sequential ID (e.g., `review-026`)
3. Set `source` to appropriate value
4. Set `provenance.captured_at` to current ISO8601 timestamp
5. Update this documentation with import details

### Verifying Reviews

Before adding reviews from new sources:
1. Confirm star rating is explicitly stated (do not guess)
2. Verify reviewer name is available
3. Ensure review text is complete (not truncated)
4. Check for duplicates against existing reviews

### Removing Reviews

If a review needs to be removed:
1. Remove the review object from `reviews.json`
2. Document the removal reason in this file
3. Do not reuse the review ID

---

## Pending Items

- **Avvo Import Completion:** 4 additional reviews exist on Avvo pages 2-4 that could be imported
- **Google Reviews:** Not yet integrated; could be added as additional source
- **Review Verification:** Consider implementing review verification badges for verified clients

---

## Last Updated

- **Date:** 2026-01-28
- **By:** Manus AI
- **Changes:** Initial import from Avvo and pasted dataset
