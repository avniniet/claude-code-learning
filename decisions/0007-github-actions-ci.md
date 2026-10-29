# 0007 — GitHub Actions CI on every PR

- **Status:** Accepted
- **Date:** 2026-10-29
- **Decided by:** AI (Claude), per issue #1

## Context
Lint, tests and the build were only run locally, so a PR could break `main` without anyone noticing. Issue #1 asks for CI on every PR plus an optional Docker build.

## Decision
- `.github/workflows/ci.yml` runs on pull requests, pushes to `main` and manual dispatch.
- Job `frontend`: Node 20 (same as the Docker build stage), `npm ci`, `npm run lint`, `npm test`, `npm run build` in `frontend/`.
- Job `docker`: after `frontend` passes, builds `docker/Dockerfile` with Buildx (GitHub Actions layer cache). Nothing is pushed to a registry.
- Read-only `contents` permission; older runs on the same ref are cancelled.

## Alternatives considered
- Run only the frontend job — would not catch Dockerfile or `.dockerignore` breakage.
- Publish the image to GHCR — no registry is used for deployment yet, so not needed now.

## Consequences
PRs show a red/green status before merge. If the Node version in `docker/Dockerfile` changes, update the workflow too. Publishing an image can be added later as a separate job.
