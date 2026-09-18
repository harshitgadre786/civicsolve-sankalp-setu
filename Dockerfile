# Multi-stage build for CivicSolve / Sankalp Setu (SIH26043)
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Build Frontend
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client ./client
RUN cd client && npm run build

# 2. Build Backend
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma
RUN cd server && npm ci && npx prisma generate

COPY server ./server
RUN cd server && npm run build

# 3. Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY server/package*.json ./server/
COPY server/prisma ./server/prisma
RUN cd server && npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Ensure SQLite DB exists and is seeded
RUN cd server && npx tsx prisma/seed.ts || true

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
