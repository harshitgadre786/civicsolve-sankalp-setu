# Multi-stage build for CivicSolve / Sankalp Setu

# =========================
# 1. BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Prisma requires OpenSSL
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="sankalp-setu-civicsolve-super-secret-key-2026"

# -------------------------
# Build Frontend
# -------------------------
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client ./client
RUN cd client && npm run build

# -------------------------
# Build Backend
# -------------------------
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma

RUN cd server && npm ci && npx prisma generate

COPY server ./server
RUN cd server && npx prisma db push --skip-generate --accept-data-loss && npx tsx prisma/seed.ts && npm run build


# =========================
# 2. PRODUCTION STAGE
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="sankalp-setu-civicsolve-super-secret-key-2026"

# Prisma requires OpenSSL
RUN apk add --no-cache openssl

# -------------------------
# Backend dependencies
# -------------------------
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma

RUN cd server && npm ci --omit=dev && npx prisma generate

# -------------------------
# Copy compiled applications and database
# -------------------------
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
RUN mkdir -p /app/uploads /app/server/uploads

EXPOSE 5000

# IMPORTANT:
# TypeScript outputs index.js inside dist/src/
CMD ["node", "server/dist/src/index.js"] 