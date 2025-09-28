# Multi-stage Dockerfile for Ethiopia Tourism Platform

# Base Node.js image
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY packages/telemetry-sdk/package.json ./packages/telemetry-sdk/
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build telemetry SDK first
WORKDIR /app/packages/telemetry-sdk
RUN pnpm build

# Build main application
WORKDIR /app
RUN pnpm build

# Production image for web app
FROM base AS web-app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

# Python analytics engine image
FROM python:3.9-slim AS analytics-engine
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY functions/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY functions/ .

# Create non-root user
RUN useradd --create-home --shell /bin/bash analytics
RUN chown -R analytics:analytics /app
USER analytics

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

EXPOSE 8000
CMD ["python", "tourism_analytics_orchestrator.py", "serve"]
