# Backend API contract

The site works without a backend today: it reads `frontend/public/data/*.json` at runtime. This document is the contract a
future backend must meet so the same frontend can run with `VITE_DATA_SOURCE=api`
([decisions/0002](../decisions/0002-data-layer-backend-ready.md)). The machine-readable version is
[`openapi.yaml`](openapi.yaml) (OpenAPI 3.0).

The source of truth for the response shapes is [`frontend/src/types/portfolio.ts`](../frontend/src/types/portfolio.ts).
If you change a type, update `openapi.yaml` and this page in the same PR.

## Endpoints

All endpoints are `GET`, take no parameters, need no authentication and return `application/json`.

| Endpoint | Response type | Same shape as | Called by |
|----------|---------------|---------------|-----------|
| `/api/v1/profile` | `Profile` | `public/data/profile.json` | `getProfile` |
| `/api/v1/skills` | `Skills` | `public/data/skills.json` | `getSkills` |
| `/api/v1/experience` | `Experience[]` | `public/data/experience.json` | `getExperience` |
| `/api/v1/projects` | `Project[]` | `public/data/projects.json` | `getProjects` |

The calls are made in `frontend/src/services/apiPortfolioService.ts`. The simplest compliant backend serves the
current JSON files unchanged from these paths.

### Rules the UI relies on

These come from how the sections use the data. They are not enforced at runtime, because the client casts the JSON
to the TypeScript types without validating it.

- **Optional fields:** `Profile.email`, `Profile.phone` and `Project.teamSize` can be left out. The UI hides them
  when absent. Every other field is required.
- **`Experience.end`** must always be present: either an ISO year-month (`"2024-06"`) or `null` for the current role,
  which is shown as "Present". `start` uses the same `YYYY-MM` format.
- **`Project.experienceId`** must match an `Experience.id`. The clients section counts each client's projects by it.
- **`Profile.links`:** a link with `label: "LinkedIn"` drives the "Connect on LinkedIn" hero button.
- **Order:** arrays are rendered in the order returned, with no client-side sorting. Return experience newest first.

## Errors

- Any non-2xx status is treated as a failure. The client throws an `HttpError` with that `status` and the page shows
  an error state with a retry button. The response body is not read, so its format is up to the backend;
  [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) `application/problem+json` is recommended (see `Problem` in the
  spec).
- The client sends `Accept: application/json` and expects a JSON body on success. A non-JSON 2xx body fails parsing
  and shows the same error state.
- The page loads all four resources in parallel and fails as a whole: one failing endpoint shows the error state for
  the whole page, and retry reloads all four.
- Requests time out after `VITE_REQUEST_TIMEOUT_MS` (default 10 s). Keep responses well under that.

## Hosting the backend

**Same origin (recommended).** Leave `VITE_API_BASE_URL` empty. The browser calls `/api/v1/...` on the site's own
origin and nginx proxies it to the backend, so no CORS is needed:

1. Add the `backend` service in `docker-compose.yml` (a commented template is there). It should listen on port 8080
   inside the Compose network.
2. Uncomment the `location /api/` block in `docker/nginx.conf`.
3. Set `VITE_DATA_SOURCE=api` in `.env` and run `docker compose up --build -d`. The values are build-time, so the
   `web` image must be rebuilt.

For local development, uncomment the `proxy` line in `frontend/vite.config.ts` so `npm run dev` proxies `/api` the same
way.

**Separate origin.** Set `VITE_API_BASE_URL` (for example `https://api.example.com`; a trailing slash is trimmed).
The backend must then send CORS headers that allow `GET` from the site's origin and the `Accept` header.

## Caching

The content changes rarely, but edits should show up straight away, like the `/data/` files that nginx serves with
`Cache-Control: no-cache`. Return the same header, ideally with an `ETag` so revalidation is cheap.

## Versioning

The `/v1` prefix is part of the path. Adding optional fields is a compatible change. Removing or renaming fields,
or changing a type, needs a new `/v2` path and a matching update to `apiPortfolioService.ts`.
