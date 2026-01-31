# Terminal Subdomain Deployment Guide

This document explains how to deploy the Terminal as a separate subdomain to isolate its heavy dependencies (mermaid/streamdown) from the main marketing site.

## Architecture Overview

The project now builds two separate bundles:

| Build | Output | Size | Contains Mermaid |
|-------|--------|------|------------------|
| Main Site | `dist/public/` | 37 MB (9 files) | No |
| Terminal | `dist/terminal/` | 50 MB (353 files) | Yes (3.2 MB) |

## Build Commands

```bash
# Build main site only (for www.gurovichlawgroup.com)
pnpm build

# Build Terminal only (for terminal.gurovichlawgroup.com)
pnpm build:terminal

# Build both
pnpm build:all
```

## Deployment Options

### Option 1: Same Server, Different Paths (Recommended)

Deploy both builds to the same server with nginx routing:

```nginx
server {
    server_name www.gurovichlawgroup.com gurovichlawgroup.com;
    
    location / {
        root /var/www/gurovich/dist/public;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
    }
}

server {
    server_name terminal.gurovichlawgroup.com;
    
    location / {
        root /var/www/gurovich/dist/terminal;
        try_files $uri $uri/ /index.html;
    }
    
    # API calls go to main site
    location /api/ {
        proxy_pass https://www.gurovichlawgroup.com;
        proxy_set_header Host www.gurovichlawgroup.com;
    }
}
```

### Option 2: Manus Hosting

If using Manus hosting:

1. **Main Site**: Publish the current checkpoint - it will deploy `dist/public/`
2. **Terminal**: Requires separate Manus project or custom domain configuration

Contact Manus support for subdomain configuration options.

## CORS Configuration

The server is already configured to accept requests from:
- `https://terminal.gurovichlawgroup.com`
- `https://www.gurovichlawgroup.com`
- `https://gurovichlawgroup.com`
- Development origins (localhost, *.manus.computer)

## Authentication

The Terminal uses the same OAuth flow as the main site:
- Cookies are shared across subdomains (set on `.gurovichlawgroup.com`)
- Login redirects work from either domain
- Session state is maintained via the shared API

## File Structure

```
client/
├── index.html          # Main site entry
├── src/                # Main site source
│   └── App.tsx         # Main site routes (Terminal quarantined)
└── terminal/
    ├── index.html      # Terminal entry
    ├── main.tsx        # Terminal bootstrap
    └── TerminalApp.tsx # Terminal wrapper

dist/
├── public/             # Main site build output
│   ├── index.html
│   └── assets/         # 9 JS chunks, no mermaid
└── terminal/           # Terminal build output
    ├── index.html
    └── assets/         # 353 JS chunks, includes mermaid
```

## Environment Variables

Both builds use the same environment variables. The Terminal's `main.tsx` automatically detects if it's running on a subdomain and adjusts the API URL accordingly.

## Testing Locally

```bash
# Start dev server (serves main site)
pnpm dev

# Access main site
open http://localhost:3000

# Access Terminal (in dev mode, use the /terminal route)
# In production, Terminal is on its own subdomain
```

## Troubleshooting

### White Screen on Main Site
If the main site shows a white screen, verify:
1. Build was run with `pnpm build` (not `pnpm build:terminal`)
2. No mermaid files in `dist/public/assets/`
3. Check browser console for JavaScript errors

### Terminal Not Loading
If Terminal shows errors:
1. Verify CORS headers are set correctly
2. Check that cookies are being sent with `credentials: include`
3. Verify the API URL is correct for the subdomain

### Authentication Issues
If login doesn't work on Terminal subdomain:
1. Ensure OAuth callback URL includes `terminal.gurovichlawgroup.com`
2. Verify cookie domain is set to `.gurovichlawgroup.com` (with leading dot)
