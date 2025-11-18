# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for API Gateway URL
ARG NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Enable pnpm
RUN corepack enable pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variable for build
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Enable pnpm
RUN corepack enable pnpm

# Install all dependencies (including devDependencies for TypeScript support)
RUN pnpm install --frozen-lockfile

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
