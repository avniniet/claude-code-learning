# 0002 — Backend-ready data layer

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** AI (Claude)

## Context
There's no backend now, but integrating one later should be smooth.

## Decision
- Content lives in `frontend/public/data/*.json` and is **fetched at runtime** over HTTP, never imported at build time.
- UI → hooks (`usePortfolio`) → `PortfolioService` interface → implementation chosen by `VITE_DATA_SOURCE`:
  - `static` (default): `StaticPortfolioService` reads `/data/*.json`.
  - `api`: `ApiPortfolioService` calls `${VITE_API_BASE_URL}/api/v1/{profile,skills,experience,projects}`.
- A single `httpClient` owns the base URL, timeouts, JSON parsing and `HttpError`. Auth and interceptors get added there.
- nginx has a commented `/api/` reverse-proxy block and compose has a commented `backend` service, so calls stay same-origin (no CORS).

## Alternatives considered
- Importing JSON into the bundle: simpler, but the UI would never exercise loading or error paths, and swapping in an API would touch components.
- React Query: good, but unnecessary for 4 read-only resources. Easy to add later behind the hooks.

## Consequences
Moving to a backend means implementing endpoints that return the types in `src/types/portfolio.ts` and setting `VITE_DATA_SOURCE=api`. No component changes.
