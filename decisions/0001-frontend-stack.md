# 0001 — Frontend stack: React 18 + Vite + TypeScript

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** Owner (AI recommendation)

## Context
A static portfolio site today that may become backend-driven later. The owner already uses React 17/18.

## Decision
React 18 + Vite + TypeScript, built to static files (`dist/`). Vitest + Testing Library for tests, ESLint for linting.

## Alternatives considered
- Plain HTML/CSS/JS: simplest, but grows poorly into an API-driven app.
- Angular: heavier for a one-page site.
- Next.js: SSR isn't needed, and it would complicate the plain-nginx setup.

## Consequences
Needs a build step (handled in Docker). Typed models act as the contract for a future API.
