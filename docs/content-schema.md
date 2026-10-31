# Content schema

All site content lives in `frontend/public/data/` as four JSON files. Their shapes are defined in
[`frontend/src/types/portfolio.ts`](../frontend/src/types/portfolio.ts), which is the source of truth: if this page and the
types disagree, the types win (and this page should be fixed). The same shapes are the contract a future backend must
return from `GET /api/v1/{profile,skills,experience,projects}` (see [decisions/0002](../decisions/0002-data-layer-backend-ready.md)).

All fields are required unless marked optional. The files are fetched at runtime, so they are not type-checked by the
build: keep them in line with the types by hand.

| File | Type | Shape |
|------|------|-------|
| `profile.json` | `Profile` | object |
| `skills.json` | `Skills` | object |
| `experience.json` | `Experience[]` | array |
| `projects.json` | `Project[]` | array |

## `profile.json` — `Profile`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Shown in the hero and navbar. |
| `title` | string | yes | Headline job title. |
| `currentRole` | string | yes | Current position and employer. |
| `location` | string | yes | |
| `yearsOfExperience` | string | yes | A string so values like `"13+"` work. |
| `tagline` | string | yes | One-line pitch in the hero. |
| `summary` | string | yes | Paragraph for the About section. |
| `stats` | `Stat[]` | yes | Highlight numbers in About. Can be empty. |
| `links` | `SocialLink[]` | yes | Shown in Contact. A link labelled exactly `LinkedIn` is also used by the hero button. |
| `email` | string | optional | Shown as a `mailto:` button in Contact when present (see [decisions/0003](../decisions/0003-content-source-and-privacy.md)). |
| `phone` | string | optional | Shown as a `tel:` button in Contact when present. Non-digit characters other than `+` are stripped from the link. |

`Stat`: `{ "value": string, "label": string }`, e.g. `{ "value": "6", "label": "Enterprise clients" }`.

`SocialLink`: `{ "label": string, "url": string }`, e.g. `{ "label": "LinkedIn", "url": "https://www.linkedin.com/in/..." }`.

## `skills.json` — `Skills`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `technical` | `SkillCategory[]` | yes | Technical skill groups. |
| `functional` | `SkillCategory[]` | yes | Leadership / delivery skill groups. |

`SkillCategory`: `{ "category": string, "items": string[] }`.

```json
{
  "technical": [{ "category": "Languages & Core", "items": ["Core Java (8/11/17)", "Multithreading"] }],
  "functional": [{ "category": "Leadership", "items": ["Team leadership & mentoring"] }]
}
```

## `experience.json` — `Experience[]`

One entry per role, most recent first (the timeline renders the array in order).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Unique, stable slug, e.g. `"cognizant-verizon"`. Referenced by `Project.experienceId`. |
| `role` | string | yes | |
| `employer` | string | yes | |
| `client` | string | yes | Also used to build the "Clients" section. |
| `domain` | string | yes | Industry domain. |
| `start` | string | yes | ISO year-month, `"YYYY-MM"`. |
| `end` | string \| null | yes | ISO year-month, or `null` for the current role (rendered as "Present"). |
| `highlights` | string[] | yes | Bullet points. |
| `stack` | string[] | yes | Technologies, rendered as tags. |

```json
{
  "id": "cognizant-verizon",
  "role": "Technical Lead & Microservices Architect",
  "employer": "Cognizant",
  "client": "Verizon",
  "domain": "Telecommunications & Supply Chain",
  "start": "2024-06",
  "end": null,
  "highlights": ["..."],
  "stack": ["Java 17", "Spring Boot"]
}
```

## `projects.json` — `Project[]`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Unique slug. |
| `name` | string | yes | |
| `summary` | string | yes | |
| `client` | string | yes | |
| `employer` | string | yes | Shown as "via &lt;employer&gt;". |
| `domain` | string | yes | Used by the Domain filter; projects with the same string are grouped together. |
| `projectType` | string | yes | Used by the Type filter, e.g. `"Greenfield Build"`. Keep spelling consistent across projects. |
| `role` | string | yes | |
| `teamSize` | string | optional | Appended to the role when present, e.g. `"4 squads · 12 engineers"`. |
| `experienceId` | string | yes | Must match an `Experience.id`; used to count projects per client. |
| `impact` | `Impact[]` | yes | Headline results. Can be empty. |
| `stack` | string[] | yes | Technologies, rendered as tags. |

`Impact`: `{ "metric": string, "description": string }`, e.g. `{ "metric": "−32%", "description": "processing latency" }`.

## After editing

- Run `cd frontend && npm test` to make sure nothing breaks, then check the page with `npm run dev`.
- The data is baked into the Docker image, so rebuild with `docker compose up --build -d` to publish changes.
- If you add or change a field, update `src/types/portfolio.ts`, the components that use it, the test fixtures in
  `src/__tests__/fixtures.ts` and this page together.
