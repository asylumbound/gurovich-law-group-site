# Deployment Summary

**Application:** Gurovich Law Group Website  
**Stack:** React 19 + Express 4 + tRPC 11 + Supabase  
**Hosting:** Manus Platform (recommended)

---

## Environment Variables

### Required Variables

| Variable | Purpose | Source |
|----------|---------|--------|
| `DATABASE_URL` | MySQL/TiDB connection | Manus Platform |
| `JWT_SECRET` | Session cookie signing | Manus Platform |
| `VITE_APP_ID` | OAuth application ID | Manus Platform |
| `OAUTH_SERVER_URL` | OAuth backend URL | Manus Platform |
| `VITE_OAUTH_PORTAL_URL` | Login portal URL | Manus Platform |
| `OWNER_OPEN_ID` | Owner's Manus ID | Manus Platform |
| `OWNER_NAME` | Owner's display name | Manus Platform |
| `SUPABASE_URL` | Supabase project URL | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Supabase Dashboard |
| `COURTLISTENER_API_TOKEN` | Case law API token | CourtListener.com |
| `OPENAI_API_KEY` | LLM for Terminal RAG | OpenAI Dashboard |

### Built-in Variables (Auto-injected)

| Variable | Purpose |
|----------|---------|
| `BUILT_IN_FORGE_API_URL` | Manus internal APIs |
| `BUILT_IN_FORGE_API_KEY` | Manus API authentication |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend Manus API access |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend Manus API URL |
| `VITE_ANALYTICS_ENDPOINT` | Analytics tracking |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics site ID |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

---

## Build & Run Commands

### Development

```bash
# Install dependencies
pnpm install

# Start development server (with hot reload)
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm tsc --noEmit
```

### Production Build

```bash
# Build frontend + backend
pnpm build

# Output:
# - dist/public/     → Static frontend assets
# - dist/index.js    → Server bundle (118.7 KB)
```

### Production Run

```bash
# Start production server
NODE_ENV=production node dist/index.js
```

---

## Hosting Configuration

### Manus Platform (Recommended)

The application is designed for Manus Platform hosting:

| Component | Configuration |
|-----------|---------------|
| Frontend | Served from `/dist/public/` via Express |
| Backend | Express server on dynamic port |
| Database | MySQL/TiDB (auto-configured) |
| Storage | Supabase Storage (external) |
| Auth | Manus OAuth (built-in) |

### Alternative: Self-Hosted

If deploying outside Manus:

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      # ... other env vars
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Database Migration Workflow

### Supabase Migrations

Migrations are stored in `supabase/migrations/`:

```
supabase/migrations/
├── 001_onboarding_schema.sql      # Core intake tables
├── 002_admin_enhancements.sql     # Admin features
├── 003_intake_storage.sql         # File storage
├── 004_terminal_rag.sql           # Terminal tables
├── 005_terminal_supabase.sql      # Terminal Supabase
├── 006_statutes_table.sql         # Legal statutes
├── 007_session_enhancements.sql   # Session features
└── 008_kc_library.sql             # Knowledge concepts
```

### Running Migrations

```bash
# Via Supabase CLI
supabase db push

# Or manually via SQL editor in Supabase Dashboard
# Copy each migration file content and execute
```

### Drizzle Schema (MySQL/TiDB)

```bash
# Generate migrations from schema changes
pnpm db:push

# This runs:
# drizzle-kit generate && drizzle-kit migrate
```

---

## Backup & Restore Strategy

### Supabase Database

**Automatic Backups:**
- Supabase Pro: Daily backups, 7-day retention
- Supabase Free: No automatic backups

**Manual Backup:**
```bash
# Export via pg_dump
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Or use Supabase Dashboard: Settings → Database → Backups
```

**Restore:**
```bash
# Import via psql
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Supabase Storage

**Backup Strategy:**
- Use `rclone` to sync to secondary storage
- Or enable Supabase Storage replication (Enterprise)

```bash
# Sync storage bucket to local
rclone sync supabase:Gurovich ./backup/storage/
```

### Application State

| Data | Backup Method | Frequency |
|------|---------------|-----------|
| Database | pg_dump / Supabase backups | Daily |
| Storage files | rclone sync | Daily |
| Environment vars | Manus Secrets UI export | On change |
| Code | Git repository | On commit |

---

## Monitoring Recommendations

### Application Monitoring

| Tool | Purpose | Implementation |
|------|---------|----------------|
| **Manus Analytics** | Page views, user sessions | Built-in |
| **Console logging** | Error tracking | Add structured logging |
| **Health endpoint** | Uptime monitoring | Add `/health` route |

### Recommended Health Endpoint

```typescript
// server/health.ts
app.get('/health', async (req, res) => {
  const checks = {
    server: 'ok',
    database: await checkDatabase(),
    supabase: await checkSupabase(),
    timestamp: new Date().toISOString(),
  };
  
  const healthy = Object.values(checks).every(v => v === 'ok' || typeof v === 'string');
  res.status(healthy ? 200 : 503).json(checks);
});
```

### Database Monitoring

| Metric | Query | Alert Threshold |
|--------|-------|-----------------|
| Connection count | `SELECT count(*) FROM pg_stat_activity` | > 80% of max |
| Table size | `SELECT pg_size_pretty(pg_total_relation_size('intakes'))` | > 1 GB |
| Slow queries | `SELECT * FROM pg_stat_statements ORDER BY mean_time DESC` | > 1s |

### Error Tracking

```typescript
// Recommended: Add Sentry or similar
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Wrap tRPC error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## CI/CD Gaps

### Current State

| Step | Status | Notes |
|------|--------|-------|
| Build | ✅ Manual | `pnpm build` |
| Test | ✅ Manual | `pnpm test` (60 tests) |
| Deploy | ✅ Manual | Manus Publish button |
| Migrations | ⚠️ Manual | Supabase Dashboard |
| Rollback | ✅ Manual | Manus checkpoint restore |

### Missing CI/CD Steps

| Step | Priority | Recommendation |
|------|----------|----------------|
| **Automated testing** | P1 | GitHub Actions on PR |
| **Build verification** | P1 | Fail PR if build fails |
| **Migration automation** | P2 | Supabase CLI in pipeline |
| **Staging environment** | P2 | Separate Manus project |
| **Performance testing** | P3 | Lighthouse CI |

### Recommended GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

---

## Unsafe Manual Processes

| Process | Risk | Mitigation |
|---------|------|------------|
| Direct DB edits | HIGH | Use migrations only |
| Manual env var changes | MEDIUM | Document in changelog |
| Skipping tests | MEDIUM | Enforce in CI |
| No staging deploy | MEDIUM | Create staging project |

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Storage bucket configured

### Deployment

- [ ] Save checkpoint in Manus
- [ ] Click Publish button
- [ ] Verify deployment URL
- [ ] Test critical flows (login, intake, admin)

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify database connectivity
- [ ] Test file uploads

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Environment Setup | ✅ Good | All vars documented |
| Build Process | ✅ Good | Single command |
| Migrations | ⚠️ Manual | Need automation |
| Backups | ⚠️ Partial | Need scheduled backups |
| Monitoring | ⚠️ Basic | Add health endpoint |
| CI/CD | ❌ Missing | Add GitHub Actions |
