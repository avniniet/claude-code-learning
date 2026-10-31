# Portfolio Website — Task Tracker

Source of truth for work status. Update the checkbox and the **Status** column as tasks move.
Architectural decisions live in [`decisions/`](decisions/README.md).

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked

## Phase 1 — Tracking setup
- [x] T1.1 Create `tasks.md`
- [x] T1.2 Create `decisions/` with README (index + ADR template)
- [x] T1.3 Record ADRs 0001–0006 (stack, data layer, content/privacy, nginx, ngrok, styling)

## Phase 2 — Frontend scaffold
- [x] T2.1 Vite + React 18 + TypeScript project in `frontend/`
- [x] T2.2 ESLint + Vitest + Testing Library configured
- [x] T2.3 `frontend/.env.example` with `VITE_DATA_SOURCE`, `VITE_API_BASE_URL`

## Phase 3 — Types & content
- [x] T3.1 Domain models in `src/types/portfolio.ts`
- [x] T3.2 `public/data/profile.json`
- [x] T3.3 `public/data/skills.json` (technical + functional)
- [x] T3.4 `public/data/experience.json` (6 roles)
- [x] T3.5 `public/data/projects.json` (6 projects, type/domain/client)
- [x] T3.6 `docs/content-schema.md`: field-by-field reference for the JSON content files (issue #1)

## Phase 4 — Service layer (backend-ready)
- [x] T4.1 `httpClient.ts` (base URL, timeout, typed errors)
- [x] T4.2 `PortfolioService` interface
- [x] T4.3 `StaticPortfolioService` (reads `/data/*.json`)
- [x] T4.4 `ApiPortfolioService` (`/api/v1/*`, ready for backend)
- [x] T4.5 Service factory driven by env config
- [x] T4.6 Hooks `useAsync`, `usePortfolio`

## Phase 5 — UI
- [x] T5.1 Design tokens, light/dark theme, theme toggle
- [x] T5.2 Shared components (Navbar, SectionHeader, Tag, Loader, ErrorState)
- [x] T5.3 Sections: Hero, About, Skills, Experience, Projects (filters), Clients, Contact
- [x] T5.4 Responsive + accessibility pass

## Phase 6 — Tests
- [x] T6.1 Service factory test
- [x] T6.2 Static service test (mocked fetch)
- [x] T6.3 Project filter logic test
- [x] T6.4 App render smoke test

## Phase 7 — Containerization
- [x] T7.1 `docker/Dockerfile` (multi-stage)
- [x] T7.2 `docker/nginx.conf` (SPA fallback, caching, headers, `/healthz`, `/api` placeholder)
- [x] T7.3 `docker-compose.yml` (web + ngrok)
- [x] T7.4 Root `.env.example`, `.gitignore`, `.dockerignore`, `README.md`

## Phase 8 — Verification
- [x] T8.1 lint / test / build pass
- [x] T8.2 Container serves site, data, deep links, `/healthz`
- [!] T8.3 Public URL via ngrok — blocked: owner must add `NGROK_AUTHTOKEN` to `.env`, then `docker compose up -d`
- [x] T8.4 GitHub Actions CI: lint + test + build on every PR, plus Docker image build (`.github/workflows/ci.yml`, ADR 0007)

## Backlog / future
- [ ] Add LinkedIn-only details (certifications, recommendations) to data files
- [ ] Implement backend and switch `VITE_DATA_SOURCE=api`
- [ ] Optional: downloadable resume PDF, contact form (needs backend)
- [ ] Mobile navigation menu (nav links are hidden below 860px; currently only the theme toggle shows)

## Change log
- 2026-10-26: Phases 1–7 done. lint / 16 tests / build pass; container healthy and serving `/`, `/data/*`, deep links, `/healthz`. Upgraded vitest to v3 for vite 6 type compatibility.
- 2026-10-29: Added GitHub Actions CI (issue #1).
