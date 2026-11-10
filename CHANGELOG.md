# Changelog

Notable changes to this project are recorded here, newest first.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The site is deployed from `main`
and is not versioned, so entries are grouped by date instead of release number.

Work status lives in [`tasks.md`](tasks.md) and the reasons behind changes live in [`decisions/`](decisions/README.md).
This file records what changed and when.

## Adding an entry

- Add a line under the `Unreleased` heading in the same PR as the change, in the category that fits:
  `Added`, `Changed`, `Fixed`, `Removed` or `Security`.
- Keep it to one line. Link the issue or PR, and the ADR if there is one.
- When changes are merged and deployed, rename `Unreleased` to the date (`YYYY-MM-DD`) and start a new
  `Unreleased` section.

## Unreleased

### Added
- `CHANGELOG.md`, replacing the change log at the end of `tasks.md` (issue #1).

## 2026-10-29

### Added
- GitHub Actions CI: lint, test and build on every PR and push to `main`, plus a Docker image build
  ([ADR 0007](decisions/0007-github-actions-ci.md), issue #1, PR #2).

## 2026-10-26

### Added
- Phases 1–7 of [`tasks.md`](tasks.md): React 18 + Vite + TypeScript frontend, backend-ready service layer,
  content JSON from the resume, light/dark theme, Vitest tests, multi-stage Docker image served by nginx, and a
  Docker Compose setup with an ngrok tunnel (ADRs [0001](decisions/0001-frontend-stack.md)–[0006](decisions/0006-styling-approach.md)).
- Verified: lint, 16 tests and build pass; the container is healthy and serves `/`, `/data/*`, deep links and `/healthz`.

### Changed
- Upgraded Vitest to v3 for type compatibility with Vite 6.
