# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
# Build-time config (Vite inlines VITE_* vars). See frontend/.env.example.
ARG VITE_DATA_SOURCE=static
ARG VITE_API_BASE_URL=
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE \
    VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/healthz || exit 1
