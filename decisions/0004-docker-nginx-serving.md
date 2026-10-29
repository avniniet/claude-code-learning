# 0004 — Multi-stage Docker image served by nginx

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** AI (Claude), per owner requirement

## Context
The site must run in Docker with nginx serving it.

## Decision
- `docker/Dockerfile`: stage 1 `node:20-alpine` runs `npm ci && npm run build`; stage 2 `nginx:1.27-alpine` serves `dist/`.
- `docker/nginx.conf`: SPA fallback (`try_files $uri /index.html`), gzip, immutable cache for `/assets/`, `no-cache` for `index.html` and `/data/`, security headers, `/healthz`, and a commented `/api/` proxy.
- Host port 8080 → container port 80.

## Consequences
Small runtime image with no Node in production. `VITE_*` variables are build-time, passed as Docker build args.
