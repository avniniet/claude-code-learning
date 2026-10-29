# 0006 — Styling: plain CSS with design tokens

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** Owner chose "clean professional"; AI chose the implementation

## Context
A clean, professional look with light/dark support and no heavy dependencies.

## Decision
Plain CSS: `styles/tokens.css` (CSS variables) + `styles/global.css`. Light theme is the default, it follows `prefers-color-scheme`, and a toggle stores the choice in `localStorage` (`data-theme` on `<html>`). One accent colour, system font stack, honours reduced motion.

## Alternatives considered
- Tailwind / a component library: more setup and more dependencies for a single page.

## Consequences
No CSS build tooling. Theme changes happen in one file.
