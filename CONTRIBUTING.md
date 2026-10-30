# Contributing

Thanks for taking a look. This is a personal portfolio site, so content changes (anything in
`frontend/public/data/`) are made by the owner, but fixes to code, docs, tests and tooling are welcome.

## Dev setup

Prerequisites: Node 20 (same as the Docker build stage and CI) and, for the production image, Docker with Compose.

```bash
cd frontend
npm ci          # install exact versions from package-lock.json
npm run dev     # http://localhost:5173
```

To run the production image locally: `docker compose up --build -d web` (see the [README](README.md)).

## Before you open a PR

Run the same checks as CI (`.github/workflows/ci.yml`) from `frontend/`:

```bash
npm run lint && npm test && npm run build
```

- If you change behaviour, add or update a Vitest test in `frontend/src/__tests__/`.
- If you change the content shape, update `frontend/src/types/portfolio.ts` and the JSON in `frontend/public/data/` together.
- Never commit `.env` files, tokens or other secrets. Use `.env.example` to document new variables.

## Branches and commits

- Branch from `main`; never push to `main` directly. Use a short descriptive name, e.g. `fix/navbar-focus` or
  `docs/deployment-guide`. Automated PRs use `auto/issue-<number>-<slug>`.
- Keep each PR small and focused on one change.
- Write commit subjects in the imperative mood ("Add mobile nav menu", not "Added ...") and reference the issue in
  the body (`Refs #1`, or `Closes #1` when the issue is fully done).

## Decisions (ADRs)

Significant decisions (a new dependency, a change in architecture, deployment or data shape) are recorded as short
Architecture Decision Records in [`decisions/`](decisions/README.md). Copy the template there, use the next number,
and add a row to the index in the same PR.

## Task tracker

Work status is tracked in [`tasks.md`](tasks.md). Tick the matching item when your PR completes it.
