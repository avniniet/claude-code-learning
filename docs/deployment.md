# Deployment

How the portfolio is built, served and published. The site is a static bundle (HTML, JS, CSS and the JSON in
`frontend/public/data/`), so anything that can serve files can host it. This repo ships one supported path,
**Docker + nginx (+ ngrok for a public URL)**, and the notes below also cover free static hosts.

Related decisions: [0004 — Docker + nginx](../decisions/0004-docker-nginx-serving.md),
[0005 — ngrok service](../decisions/0005-ngrok-compose-service.md),
[0002 — backend-ready data layer](../decisions/0002-data-layer-backend-ready.md).

## Configuration

All configuration comes from environment variables. Copy the root `.env.example` to `.env` (gitignored) and fill it in.

| Variable | Used by | Default | Purpose |
|----------|---------|---------|---------|
| `NGROK_AUTHTOKEN` | `ngrok` service | empty | Required for the public tunnel. Without it the ngrok container exits; `web` keeps working. |
| `NGROK_DOMAIN` | `ngrok` service | empty | Optional reserved/static ngrok domain (passed as `--url`). |
| `WEB_PORT` | `web` service | `8080` | Host port mapped to nginx's port 80. |
| `VITE_DATA_SOURCE` | build | `static` | `static` reads `/data/*.json`; `api` calls `/api/v1/*`. |
| `VITE_API_BASE_URL` | build | empty | Backend origin when `VITE_DATA_SOURCE=api`. Empty means same origin (nginx proxies `/api/`). |

`VITE_*` values are **build-time**: Vite inlines them into the bundle, so changing them needs a rebuild
(`docker compose up --build -d`). `docker-compose.yml` passes `VITE_DATA_SOURCE` and `VITE_API_BASE_URL` as build args.
`VITE_REQUEST_TIMEOUT_MS` (default `10000`) is read by `src/config/env.ts` but is not wired through as a Docker build
arg, so it only applies to local builds unless you add it to `docker/Dockerfile` and `docker-compose.yml`.

## Docker image

`docker/Dockerfile` is a two-stage build:

1. **build** — `node:20-alpine`: `npm ci`, then `npm run build` (type-check + Vite build) with the `VITE_*` build args.
2. **runtime** — `nginx:1.27-alpine`: copies `docker/nginx.conf` and `dist/` only, so there is no Node in production.

The image has a `HEALTHCHECK` that calls `/healthz`. `.dockerignore` keeps `node_modules`, `dist`, `.env*`, `.git`,
`decisions/` and `tasks.md` out of the build context.

```bash
# Build and run without Compose
docker build -f docker/Dockerfile -t portfolio-web .
docker run --rm -p 8080:80 portfolio-web
```

CI (`.github/workflows/ci.yml`) builds this image on every PR and push to `main`, without pushing it anywhere.

## nginx

`docker/nginx.conf` serves `/usr/share/nginx/html` on port 80.

| Location | Behaviour |
|----------|-----------|
| `= /healthz` | Returns `200 ok` as plain text, no access log. Used by the image and Compose health checks. |
| `/assets/` | Hashed Vite output. `expires 1y` + `Cache-Control: public, immutable`. Missing files are a 404. |
| `/data/` | Portfolio JSON. `Cache-Control: no-cache`, so browsers revalidate and content edits show up straight away. |
| `/api/` | Commented-out reverse proxy to `backend:8080`. Enable it together with the `backend` Compose service. |
| `/` | SPA fallback: `try_files $uri $uri/ /index.html` with `no-cache`, so deep links load the app and new deploys are picked up. |

Every response also gets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` and
`Referrer-Policy: strict-origin-when-cross-origin`; `server_tokens` is off. gzip is on for text, CSS, JS, JSON and
SVG over 1 KB.

nginx `add_header` directives are not inherited by a `location` that defines its own `add_header`, which is why
`X-Content-Type-Options` is repeated in each block. Keep that in mind when adding headers.

## Docker Compose

`docker-compose.yml` defines:

- **web** — builds the image above, maps `${WEB_PORT:-8080}:80`, restarts unless stopped, health-checked via `/healthz`.
- **ngrok** — `ngrok/ngrok:3`, tunnels to `web:80`, starts only after `web` is healthy, exposes the inspector on `4040`.
- **backend** — commented out; see [Adding a backend](#adding-a-backend).

```bash
cp .env.example .env              # add NGROK_AUTHTOKEN (and NGROK_DOMAIN if you have one)
docker compose up --build -d      # web + ngrok
docker compose up --build -d web  # local only, no tunnel
curl localhost:8080/healthz       # -> ok
docker compose down
```

### ngrok

1. Create an ngrok account and copy your authtoken from the ngrok dashboard
   (`https://dashboard.ngrok.com/get-started/your-authtoken`).
2. Put it in `.env` as `NGROK_AUTHTOKEN=...`. Optionally set `NGROK_DOMAIN` to a reserved domain so the URL stays the same
   between restarts; without it ngrok assigns a new random URL each time.
3. `docker compose up -d`, then find the public URL at <http://localhost:4040> or with `docker compose logs ngrok`.

The tunnel lives only as long as the machine running Compose is up, so it suits demos rather than permanent hosting.

### Updating content

Content is baked into the image. After editing `frontend/public/data/*.json`, rebuild with
`docker compose up --build -d`. Because `/data/` is served with `no-cache`, visitors get the new content on their next
load.

## Free static hosting

For an always-on URL without running a machine, deploy the `frontend/dist/` output to a static host. Settings for any of
them:

- **Base directory:** `frontend`
- **Build command:** `npm ci && npm run build`
- **Output directory:** `dist`
- **Node version:** 20 (same as CI and the Docker build stage)
- **Environment:** `VITE_DATA_SOURCE=static` (the default)

Things nginx does that you need to replicate or accept losing:

- **SPA fallback.** The app currently has a single page, so this mostly matters for unknown paths. Netlify:
  add `frontend/public/_redirects` with `/*  /index.html  200`. Cloudflare Pages serves `index.html` for unknown paths by
  default when there is no `404.html`.
- **Caching and security headers.** Netlify and Cloudflare Pages both read a `frontend/public/_headers` file, e.g.

  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /data/*
    Cache-Control: no-cache
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    Referrer-Policy: strict-origin-when-cross-origin
  ```

- **`/healthz`** is nginx-only and won't exist on a static host.

These files are not in the repo yet; add them if you adopt one of these hosts.

### GitHub Pages caveat

GitHub Pages project sites are served from a sub-path (`https://<user>.github.io/claude-code-learning/`). The app
currently assumes it is served from the domain root: Vite's `base` is the default `/`, and the static service fetches
absolute paths such as `/data/profile.json`. On a project site those requests would 404. To use GitHub Pages either:

- use a custom domain (or a `<user>.github.io` user site) so the app is at the root, or
- set `base` in `frontend/vite.config.ts` and make the data paths respect `import.meta.env.BASE_URL` (a code change).

Netlify and Cloudflare Pages serve from the root, so they work without changes.

## Adding a backend

When a backend exists (see [decisions/0002](../decisions/0002-data-layer-backend-ready.md)):

1. Uncomment the `backend` service in `docker-compose.yml` and the `location /api/` block in `docker/nginx.conf`.
2. Set `VITE_DATA_SOURCE=api` in `.env` (leave `VITE_API_BASE_URL` empty to go through the nginx proxy on the same
   origin, which avoids CORS).
3. `docker compose up --build -d`.

With a static host, the backend has to live on another origin: set `VITE_API_BASE_URL` to it and enable CORS there.
