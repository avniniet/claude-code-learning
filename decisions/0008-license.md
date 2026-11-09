# 0008 — MIT license for code; personal content excluded

- **Status:** Accepted
- **Date:** 2026-11-09
- **Decided by:** AI (Claude), per issue #1 (which suggests MIT)

## Context
The repo had no license, so by default nobody could legally reuse any of it. Issue #1 asks for a `LICENSE`, suggests MIT for the code, and asks that the personal content in `frontend/public/data/` is explicitly not covered.

## Decision
- Add a standard, unmodified MIT `LICENSE` at the repo root, copyright the owner (name as in `profile.json`). Keeping the text unmodified lets GitHub detect it as MIT.
- The content in `frontend/public/data/*.json` (profile, skills, experience, projects: the owner's personal and career details) is **not** covered by the MIT license; all rights reserved. This is stated in the README "License" section rather than inside `LICENSE`.

## Alternatives considered
- No license — blocks reuse of the code, which is the point of a public learning repo.
- Apache-2.0 — adds a patent grant and NOTICE handling that a small static site does not need.
- Put the content exclusion inside `LICENSE` — non-standard text stops GitHub from recognising the license.

## Consequences
Anyone may fork the code as a template, but must replace the files in `public/data/` with their own content. If the owner prefers a different license or wants to license the content (e.g. CC BY-NC), update `LICENSE`, the README section and this ADR.
