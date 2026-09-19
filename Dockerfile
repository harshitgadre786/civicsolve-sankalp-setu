# Multi-stage production build for CivicSolve / Sankalp Setu (SIH26043)

# ==========================================
# STAGE 1 — CLIENT BUILDER
# ==========================================
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy client dependency manifests
COPY client/package*.json ./

# Install all client dependencies (including typescript and vite)
RUN npm ci

# Copy client source code and assets
COPY client/ ./

# Run TypeScript compilation and Vite production build -> generates client/dist
RUN npm run build


# ==========================================
# STAGE 2 — SERVER / PRISMA BUILDER
# ==========================================
FROM node:20-alpine AS server-builder

WORKDIR /app/server

# OpenSSL is required by the Prisma engine on Alpine
RUN apk add --no-cache openssl

# Set build-time database URL for schema validation
ENV DATABASE_URL="file:./dev.db"

# Copy server dependency manifests and Prisma schema
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install server dependencies (including prisma CLI and typescript)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Create initial database tables schema
RUN npx prisma db push --skip-generate --accept-data-loss

# Copy server source code and tsconfig
COPY server/ ./

# Compile server TypeScript -> generates dist/src/index.js and dist/prisma/seed.js
RUN npm run build


# ==========================================
# STAGE 3 — PRODUCTION RUNTIME
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# OpenSSL is required by Prisma engine at runtime
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="sankalp-setu-civicsolve-super-secret-key-2026"

# Install production-only server dependencies
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/

RUN cd server && npm ci --omit=dev

# Copy generated Prisma Client from server-builder
COPY --from=server-builder /app/server/node_modules/@prisma/client ./server/node_modules/@prisma/client
COPY --from=server-builder /app/server/node_modules/.prisma ./server/node_modules/.prisma

# Copy initialized prisma folder with dev.db
COPY --from=server-builder /app/server/prisma ./server/prisma

# Copy compiled backend output from server-builder
COPY --from=server-builder /app/server/dist ./server/dist

# Copy compiled frontend distribution from client-builder
COPY --from=client-builder /app/client/dist ./client/dist

# Create uploads directory for user-submitted media
RUN mkdir -p /app/uploads /app/server/uploads

EXPOSE 5000

# Start compiled production server on 0.0.0.0:PORT
CMD ["node", "server/dist/src/index.js"]