# ── Stage 1: Dependencies ─────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* wird zur BUILD-Zeit ins Client-Bundle eingebacken →
# muss als Build-Arg rein (kommt aus .env via docker-compose)
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_PREFER_TTS=1
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_PREFER_TTS=$NEXT_PUBLIC_PREFER_TTS \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Runtime (klein, non-root) ────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Server-seitiger Audio-Cache (TTS) – wird als Volume persistiert
RUN mkdir -p .audio-cache && chown nextjs:nodejs .audio-cache
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
