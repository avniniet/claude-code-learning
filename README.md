# Avnish Kumar Mishra — Portfolio

Static React + Vite + TypeScript portfolio, served by nginx in Docker and exposed publicly through ngrok.

- Work tracker: [`tasks.md`](tasks.md)
- Decision log (read first when resuming): [`decisions/`](decisions/README.md)

## Run with Docker (production)

```bash
cp .env.example .env          # add NGROK_AUTHTOKEN (and NGROK_DOMAIN if you have one)
docker compose up --build -d  # web on http://localhost:8080 + ngrok tunnel
```

- Public URL: open the ngrok inspector at http://localhost:4040 or run `docker compose logs ngrok`.
- Local only (no ngrok): `docker compose up --build -d web`
- Health check: `curl localhost:8080/healthz`
- Stop: `docker compose down`

## Develop locally

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
npm test        # vitest
npm run lint
npm run build
```

## Editing content

All content lives in `frontend/public/data/`:

| File | Contents |
|------|----------|
| `profile.json` | name, title, summary, stats, links |
| `skills.json` | technical + functional skill groups |
| `experience.json` | roles / employers / clients timeline |
| `projects.json` | projects with type, domain, client, impact |

The shapes are defined in `frontend/src/types/portfolio.ts`. Data is baked into the image, so run `docker compose up --build -d` after editing. nginx serves `/data/` with `no-cache`, so visitors get the new content straight away.

## Adding a backend later

See [decisions/0002](decisions/0002-data-layer-backend-ready.md). In short:

1. Implement `GET /api/v1/{profile,skills,experience,projects}` returning the types in `src/types/portfolio.ts`.
2. Uncomment the `backend` service in `docker-compose.yml` and the `/api/` block in `docker/nginx.conf`.
3. Set `VITE_DATA_SOURCE=api` in `.env` and rebuild. No component changes are needed.

## Learning with Claude Code

The repo is called `claude-code-learning` because it was built while learning [Claude Code](https://claude.com/claude-code). Claude Code is used as a pair programmer and also as part of the workflow itself:

- **Decisions are written down.** Every significant choice, whether made by Claude or by the owner, gets an ADR in [`decisions/`](decisions/README.md). The ADR's `Decided by` field records who made it. A new session reads the index to rebuild context instead of relying on chat history.
- **Work is tracked in [`tasks.md`](tasks.md)** so that any session, human or AI, can see what's done, in progress or blocked.
- **Small PRs from issues.** Branches named `auto/issue-<n>-<slug>` are opened by Claude Code. Each one addresses a single issue or a few checklist items, and its PR lists the verification commands it ran. CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) checks every PR before the owner reviews and merges it.

### The `.claude/` directory

| Path | What it does |
|------|--------------|
| [`.claude/settings.json`](.claude/settings.json) | Project settings shared through git. Registers two hooks that run `review-changed-file.sh`: `PostToolUse` after Claude's `Edit`/`Write`/`MultiEdit` tools change a file, and `FileChanged` when key config files (`docker-compose.yml`, `package.json`, `vite.config.ts`, `index.html`, `eslint.config.js`, `tsconfig.json`) change on disk. |
| [`.claude/hooks/review-changed-file.sh`](.claude/hooks/review-changed-file.sh) | Takes the changed file's path from the hook input, skips anything that isn't source or config (and skips `node_modules/`, `dist/`, lockfiles and `.claude/` itself), then diffs the file against a snapshot from its last review. It starts the `code-reviewer` agent in the background through headless `claude -p`. A newer save cancels a review that is still running, and an environment flag stops the reviewer from triggering itself. |
| [`.claude/agents/code-reviewer.md`](.claude/agents/code-reviewer.md) | A read-only subagent (`Read`, `Grep`, `Glob` only) that reviews **the diff**, not the whole file. It ranks findings by severity in this order: bugs, security, contracts, tests, performance, accessibility, maintainability. It checks the change against the ADRs and writes a fixed-format Markdown report. You can also ask for it by hand, for example "review my changes to X". |

Reviews are written to `.claude/reviews/<path with / replaced by __>.md` (snapshots are kept in `.claude/reviews/.snapshots/`). That directory is git-ignored. The hook needs `jq` and the `claude` CLI on your `PATH`. When you aren't using Claude Code, it never runs and has no effect on the build.

## Layout

```
decisions/           ADRs
docker/              Dockerfile, nginx.conf
frontend/
  public/data/       content (runtime JSON)
  src/types/         domain contract
  src/config/        env config
  src/services/      httpClient, PortfolioService (static | api), factory
  src/hooks/         useAsync, usePortfolio
  src/components/    shared UI
  src/sections/      page sections
  src/utils/         filtering / derivations
  src/__tests__/     vitest
```
