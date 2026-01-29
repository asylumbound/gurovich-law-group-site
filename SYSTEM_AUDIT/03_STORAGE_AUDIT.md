# Supabase Storage Audit

**Storage Provider:** Supabase Storage (S3-compatible)  
**Audit Date:** January 29, 2026

---

## Bucket Inventory

```javascript
// Query used:
const { data: buckets } = await supabase.storage.listBuckets();
```

| Bucket Name | Public | Created | Files | Status |
|-------------|--------|---------|-------|--------|
| GUROVICH | false | 2026-01-29 05:03:34 | 0 | ⚠️ Duplicate - DELETE |
| Gurovich | true | 2026-01-29 07:12:05 | 0 | ✅ Primary bucket |

### Issue: Duplicate Buckets

Two buckets exist with similar names (case difference). This creates confusion and potential data fragmentation.

**Recommendation:** Delete the unused "GUROVICH" bucket:

```javascript
await supabase.storage.deleteBucket('GUROVICH');
```

---

## Bucket Structure

### Expected Path Convention

```
Gurovich/
├── clients/
│   └── {intake_id}/
│       ├── .keep                    # Folder placeholder
│       ├── {upload_id}_{filename}   # Uploaded documents
│       └── ...
```

### Naming Convention

| Component | Format | Example |
|-----------|--------|---------|
| Bucket | PascalCase | `Gurovich` |
| Client folder | `clients/{intake_id}/` | `clients/123/` |
| File name | `{upload_id}_{sanitized_name}` | `456_contract.pdf` |

### File Sanitization

```typescript
// From server/intake-storage.ts
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);
}
```

---

## Access Controls

### Bucket Policies

| Bucket | Policy | Risk |
|--------|--------|------|
| Gurovich | Public | ⚠️ MEDIUM - All files publicly accessible |
| GUROVICH | Private | N/A (unused) |

### Current Access Pattern

```typescript
// From server/intake-storage.ts
const { data, error } = await supabase.storage
  .from('Gurovich')
  .upload(filePath, buffer, {
    contentType: mimeType,
    upsert: false,
  });
```

**Issue:** The "Gurovich" bucket is public, meaning any uploaded file URL can be accessed without authentication.

### Recommended Access Pattern

```typescript
// Option 1: Make bucket private + use signed URLs
const { data: signedUrl } = await supabase.storage
  .from('Gurovich')
  .createSignedUrl(filePath, 3600); // 1 hour expiry

// Option 2: Use RLS policies on storage
// (Requires Supabase Pro plan)
```

---

## Signed URL Analysis

### Current Implementation

```typescript
// server/intake-storage.ts - getFileUrl
export async function getFileUrl(filePath: string): Promise<string | null> {
  const { data } = supabase.storage
    .from('Gurovich')
    .getPublicUrl(filePath);
  
  return data?.publicUrl || null;
}
```

**Issue:** Using `getPublicUrl()` instead of `createSignedUrl()` means URLs never expire.

### Recommended Implementation

```typescript
export async function getFileUrl(
  filePath: string, 
  expiresIn: number = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('Gurovich')
    .createSignedUrl(filePath, expiresIn);
  
  if (error) {
    console.error('Failed to create signed URL:', error);
    return null;
  }
  
  return data?.signedUrl || null;
}
```

---

## File Processing

### Upload Limits

| Setting | Current | Recommended |
|---------|---------|-------------|
| Max file size | 10 MB | 10 MB (keep) |
| Allowed MIME types | Configured | Keep current list |
| File count per intake | Unlimited | Consider limit (e.g., 20) |

### Allowed MIME Types

```typescript
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
```

### Upload Flow

```
1. Client → POST /api/trpc/onboard.uploadFile
2. Server validates:
   - File size ≤ 10 MB
   - MIME type in allowed list
   - User has draft token
3. Server uploads to Supabase Storage
4. Server creates intake_uploads record
5. Server returns file metadata
```

### Retry Behavior

**Current:** No retry logic implemented.

**Recommendation:** Add exponential backoff for upload failures:

```typescript
async function uploadWithRetry(
  filePath: string, 
  buffer: Buffer, 
  options: UploadOptions,
  maxRetries: number = 3
): Promise<UploadResult> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from('Gurovich')
        .upload(filePath, buffer, options);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await sleep(Math.pow(2, attempt) * 1000); // 2s, 4s, 8s
    }
  }
}
```

---

## Security Assessment

### Exposure Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Public bucket | MEDIUM | Switch to signed URLs |
| No URL expiration | MEDIUM | Implement signed URLs with TTL |
| Path enumeration | LOW | Random upload IDs prevent guessing |
| File type bypass | LOW | Server-side MIME validation |

### Sensitive File Types

| File Type | Contains | Protection |
|-----------|----------|------------|
| PDF | Legal documents, contracts | Needs signed URLs |
| Images | Evidence photos | Needs signed URLs |
| Word docs | Correspondence | Needs signed URLs |

---

## Recommendations

### P0: Switch to Signed URLs

```typescript
// 1. Make bucket private
// (Via Supabase Dashboard: Storage → Gurovich → Settings → Private)

// 2. Update getFileUrl to use signed URLs
export async function getFileUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('Gurovich')
    .createSignedUrl(filePath, 3600);
  
  return data?.signedUrl || null;
}
```

### P1: Delete Duplicate Bucket

```javascript
// Run once via admin script
const { error } = await supabase.storage.deleteBucket('GUROVICH');
if (error) console.error('Failed to delete bucket:', error);
```

### P2: Add Upload Retry Logic

See retry implementation above.

### P3: Add File Count Limits

```typescript
// In onboard-router.ts uploadFile procedure
const { count } = await supabase
  .from('intake_uploads')
  .select('*', { count: 'exact', head: true })
  .eq('intake_id', intakeId);

if (count >= 20) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Maximum 20 files per intake',
  });
}
```

---

## Summary

| Category | Status | Action |
|----------|--------|--------|
| Bucket Structure | ⚠️ Duplicate exists | Delete GUROVICH bucket |
| Access Control | ⚠️ Public bucket | Switch to signed URLs |
| File Validation | ✅ Good | None |
| Upload Flow | ✅ Good | Add retry logic |
| Path Security | ✅ Good | Random IDs prevent enumeration |
