# =============================================================================
# STAGE 1: BASE
# Purpose: Set up the base image with Node.js and pnpm
# =============================================================================
FROM node:20-alpine AS base

# Why Alpine?
# - Minimal Linux distribution (~5MB vs ~100MB for Debian)
# - Smaller attack surface, faster pulls
# - Trade-off: Some packages may need extra configuration

# Install libc6-compat for Alpine compatibility with some npm packages
# Some packages are compiled against glibc, but Alpine uses musl libc
RUN apk add --no-cache libc6-compat

# Enable corepack to use pnpm (built into Node.js 16.13+)
# Corepack manages package manager versions
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory for all subsequent commands
WORKDIR /app


# =============================================================================
# STAGE 2: DEPENDENCIES
# Purpose: Install all dependencies (cached layer)
# =============================================================================
FROM base AS deps

# Copy only package files first (Docker layer caching optimization)
# If these files don't change, Docker reuses the cached node_modules
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for building)
# --frozen-lockfile ensures reproducible installs (fails if lockfile is outdated)
RUN pnpm install --frozen-lockfile


# =============================================================================
# STAGE 3: BUILDER
# Purpose: Build the Next.js application
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
# --from=deps copies files from a previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build-time environment variables (NEXT_PUBLIC_* are embedded into JS bundle)
# ARG = build-time variable, ENV = runtime variable
# These MUST be provided during `docker build` with --build-arg

ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/conversations
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/conversations
ARG NEXT_PUBLIC_APP_URL

# Convert ARGs to ENVs so Next.js can access them during build
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
# This creates .next/standalone with a minimal server
RUN pnpm build


# =============================================================================
# STAGE 4: RUNNER (Production)
# Purpose: Minimal production runtime
# =============================================================================
FROM base AS runner

WORKDIR /app

# Set to production mode
ENV NODE_ENV=production

# Disable telemetry in production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
# Running as root in containers is a security risk
# If container is compromised, attacker has limited privileges
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets (static files like favicon, images)
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
# Next.js needs to write to .next folder for ISR/caching
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build output
# The standalone folder contains:
# - server.js (minimal Node.js server)
# - Required node_modules (only production deps, tree-shaken)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets generated during build
# These are served directly by the Next.js server
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Document the port (metadata only, doesn't actually expose)
# Actual port exposure happens with `docker run -p`
EXPOSE 3000

# Set port for Next.js server
ENV PORT=3000

# Set hostname to listen on all interfaces (required for Docker)
# 0.0.0.0 means accept connections from outside the container
ENV HOSTNAME="0.0.0.0"

# Start the application
# Using node directly (not pnpm/npm) for minimal overhead
CMD ["node", "server.js"]
