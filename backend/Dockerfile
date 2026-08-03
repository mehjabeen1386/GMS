# Purpose: Multi-stage Docker Build for Node.js Express Backend
# Path: backend/Dockerfile
# ==========================================
# Stage 1: Build Dependencies Stage
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build steps/tests if needed)
RUN npm ci

# Copy application source code
COPY . .

# Prune devDependencies to keep production image light
RUN npm prune --production

# ==========================================
# Stage 2: Final Production Runtime Image
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set production environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Copy pruned production dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/config ./config

# Create logs directory and assign full ownership to 'node' user
RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app

# Use non-root 'node' user for enhanced security
USER node

# Expose internal API application port
EXPOSE 5000

# Health check to ensure container readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application HTTP server
CMD ["node", "src/server.js"]