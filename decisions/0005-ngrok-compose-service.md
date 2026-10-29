# 0005 — ngrok as a Docker Compose service

- **Status:** Accepted
- **Date:** 2026-10-26
- **Decided by:** Owner (AI recommendation)

## Context
The site should be reachable publicly through ngrok. The ngrok CLI isn't installed on the host.

## Decision
A `ngrok` service in `docker-compose.yml` using the official `ngrok/ngrok` image, tunnelling to `web:80`. `NGROK_AUTHTOKEN` (required) and `NGROK_DOMAIN` (optional static domain) come from a gitignored `.env`. The inspector UI is on `localhost:4040`.

## Consequences
`docker compose up -d` starts everything. Without a token the ngrok container exits, but `web` keeps working locally.
