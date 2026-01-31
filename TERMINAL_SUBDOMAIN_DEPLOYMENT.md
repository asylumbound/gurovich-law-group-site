# Terminal Subdomain Deployment Guide

This guide provides step-by-step instructions for deploying the Terminal application to `terminal.gurovich.law` as a separate subdomain, completely isolating its heavy dependencies (mermaid, streamdown, shiki) from the main marketing site.

---

## Overview

The Terminal is a staff-only RAG assistant that requires heavy JavaScript libraries for markdown rendering, syntax highlighting, and diagram generation. These libraries add approximately 3.2 MB to the bundle, which is unacceptable for the public-facing marketing site. By hosting the Terminal on a separate subdomain, we achieve complete bundle isolation while maintaining shared authentication and API access.

| Component | Main Site (gurovich.law) | Terminal (terminal.gurovich.law) |
|-----------|--------------------------|----------------------------------|
| Bundle Size | 637 KB | 3.2 MB (lazy loaded) |
| Target Audience | Public visitors | Staff only |
| Dependencies | React, Tailwind, tRPC | + Mermaid, Streamdown, Shiki |
| Authentication | Manus OAuth | Manus OAuth (shared cookies) |
| API Endpoint | /api/trpc | gurovich.law/api/trpc (CORS) |

---

## Option 1: Deploy to Vercel (Recommended)

Vercel provides free hosting with automatic SSL and excellent performance. This is the recommended approach for the Terminal subdomain.

### Step 1: Build the Terminal

Run the Terminal-specific build command from the project root:

```bash
cd /home/ubuntu/gurovich-law-group-site
VITE_BUILD_TARGET=terminal pnpm build
```

This generates the Terminal build in `dist/terminal/` with its own `index.html` and all required assets.

### Step 2: Create a Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **Add New → Project**
3. Choose **Import Git Repository** or **Upload** (for manual deployment)

**For Git-based deployment:**
- Connect your GitHub repository
- Set the **Root Directory** to `dist/terminal`
- Set **Build Command** to `VITE_BUILD_TARGET=terminal pnpm build`
- Set **Output Directory** to `dist/terminal`

**For manual upload:**
- Zip the contents of `dist/terminal/`
- Drag and drop to Vercel

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `VITE_APP_ID` | (copy from main site) |
| `VITE_OAUTH_PORTAL_URL` | `https://login.manus.im` |
| `VITE_FRONTEND_FORGE_API_URL` | (copy from main site) |
| `VITE_FRONTEND_FORGE_API_KEY` | (copy from main site) |

### Step 4: Configure Custom Domain

1. In Vercel Project Settings → Domains
2. Add `terminal.gurovich.law`
3. Vercel will provide DNS instructions

### Step 5: Configure DNS

In your domain registrar (or Manus Domains settings):

1. Add a **CNAME record**:
   - Name: `terminal`
   - Value: `cname.vercel-dns.com`
   - TTL: 3600 (or Auto)

2. Wait for DNS propagation (usually 5-30 minutes)

### Step 6: Verify Deployment

1. Visit `https://terminal.gurovich.law`
2. You should see the Terminal login page
3. Log in with your Manus credentials
4. Verify you can access intakes and chat with the assistant

---

## Option 2: Create a Separate Manus Project

If you prefer to keep everything within the Manus platform, you can create a standalone Terminal project.

### Step 1: Create New Manus Project

1. In Manus, create a new project named "Gurovich Terminal"
2. Choose the "Static" template (we'll upload pre-built files)

### Step 2: Extract Terminal Code

Copy these files/folders to the new project:

```
client/terminal/           → client/src/
client/src/components/     → client/src/components/
client/src/lib/            → client/src/lib/
client/src/_core/          → client/src/_core/
shared/                    → shared/
```

### Step 3: Update API Configuration

In the new project, update `client/src/lib/trpc.ts` to point to the main site API:

```typescript
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "https://www.gurovich.law/api/trpc",
      // ... rest of config
    }),
  ],
});
```

### Step 4: Configure Domain

1. In Manus Project Settings → Domains
2. Add `terminal.gurovich.law` as a custom domain
3. Follow DNS configuration instructions

---

## Option 3: Path-Based Routing (No Subdomain)

If you want to avoid subdomain complexity, you can host Terminal at `gurovich.law/terminal`. However, this brings the mermaid bundle back into the main site.

### Step 1: Re-enable Terminal Route

In `client/src/App.tsx`, uncomment the Terminal import and route:

```tsx
const Terminal = lazy(() => import("@/pages/Terminal"));

// In routes:
<Route path="/terminal" component={Terminal} />
```

### Step 2: Rebuild

```bash
pnpm build
```

**Warning:** This will increase the main bundle size and may cause the white screen issue to return if mermaid fails to load.

---

## CORS Configuration

The main site's server is already configured to accept requests from `terminal.gurovich.law`. The CORS middleware in `server/_core/index.ts` includes:

```typescript
const allowedOrigins = [
  "https://www.gurovich.law",
  "https://gurovich.law",
  "https://terminal.gurovich.law",
  // ... development origins
];
```

If you use a different subdomain, update this list accordingly.

---

## Authentication Flow

The Terminal uses the same Manus OAuth as the main site. For cross-subdomain authentication to work:

1. **Cookie Domain:** Ensure cookies are set with `domain=.gurovich.law` (note the leading dot) so they're shared across subdomains
2. **OAuth Redirect:** The OAuth callback should redirect back to the Terminal subdomain after login

The current implementation handles this automatically when both sites are under the same root domain.

---

## Troubleshooting

### Terminal shows white screen

Check the browser console for JavaScript errors. Common causes:
- Mermaid initialization failure (check if mermaid chunk loaded)
- CORS errors (check server allows the subdomain origin)
- OAuth redirect loop (check cookie domain settings)

### API calls fail with CORS error

1. Verify `terminal.gurovich.law` is in the CORS allowed origins list
2. Rebuild and redeploy the main site
3. Clear browser cache and retry

### Login doesn't persist

1. Check that cookies are set with `domain=.gurovich.law`
2. Verify both sites use the same `VITE_APP_ID`
3. Check browser's cookie settings (third-party cookies must be allowed)

### Terminal can't access intakes

1. Verify the user has `intake_access` records in the database
2. Check that the API endpoint is correct (`https://www.gurovich.law/api/trpc`)
3. Verify the JWT token is being sent with requests

---

## Summary

| Deployment Option | Pros | Cons |
|-------------------|------|------|
| **Vercel** | Free, fast, automatic SSL, easy updates | Requires Vercel account |
| **Separate Manus Project** | All-in-one platform | More setup, potential sync issues |
| **Path-Based** | Simplest setup | Brings back bundle size issues |

**Recommended:** Deploy to Vercel for the best balance of simplicity, performance, and isolation.
