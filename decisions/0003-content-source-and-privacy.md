# 0003 — Content source and privacy

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** Owner

## Context
The resume (`Avnish Kumar Mishra_Resume_27102026.pdf`) contains placeholder email, phone and education. The owner declined automated LinkedIn fetching.

## Decision
- All content comes from the resume only. LinkedIn-only details (certifications, recommendations) are backlog items to add to the JSON files.
- The only public contact is the LinkedIn URL `https://www.linkedin.com/in/avnish-mishra-26567632/`. No email, phone or education section.
- Client names are shown as on the resume, with the employer noted ("via Cognizant"). Metrics are copied verbatim (−32% latency, −40% manual effort, +25% efficiency).

## Consequences
To add contact info or education later, update `profile.json` and the types. The UI hides fields that are absent.

## Amendment — 2026-10-27
The owner chose to publish an email address (`avniniet@gmail.com`) and, once provided, a mobile number. These are stored as optional `email` / `phone` fields in `profile.json` and shown in the Contact section as `mailto:` / `tel:` links. This replaces the "LinkedIn only" contact rule above; education is still omitted.
