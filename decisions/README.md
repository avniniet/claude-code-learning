# Decision Log (ADRs)

Every significant decision made while building this project, whether by AI or by a human, is recorded here as a short
Architecture Decision Record. Read this index first when resuming work: it is the quickest way to rebuild context.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [0001](0001-frontend-stack.md) | Frontend stack: React 18 + Vite + TypeScript | Accepted | 2026-10-26 |
| [0002](0002-data-layer-backend-ready.md) | Backend-ready data layer (service interface + runtime JSON) | Accepted | 2026-10-26 |
| [0003](0003-content-source-and-privacy.md) | Content source = resume; LinkedIn-only contact | Accepted | 2026-10-26 |
| [0004](0004-docker-nginx-serving.md) | Multi-stage Docker image served by nginx | Accepted | 2026-10-26 |
| [0005](0005-ngrok-compose-service.md) | ngrok as a Docker Compose service | Accepted | 2026-10-26 |
| [0006](0006-styling-approach.md) | Plain CSS with design tokens, light/dark theme | Accepted | 2026-10-26 |
| [0007](0007-github-actions-ci.md) | GitHub Actions CI on every PR | Accepted | 2026-10-29 |

## Adding a decision

1. Copy the template below to `NNNN-short-slug.md` (next number).
2. Fill it in, keep it short.
3. Add a row to the index. If it replaces an older ADR, mark that one `Superseded by NNNN`.

## Template

```markdown
# NNNN — Title

- **Status:** Proposed | Accepted | Superseded by NNNN
- **Date:** YYYY-MM-DD
- **Decided by:** AI (Claude) | Owner | Both

## Context
What problem or requirement forced a decision.

## Decision
What we chose.

## Alternatives considered
- Option — why not.

## Consequences
What becomes easier/harder; follow-ups.
```
