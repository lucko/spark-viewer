# Install dependencies only when needed
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile


# Rebuild the source code only when needed
FROM node:22-alpine AS builder
RUN apk add --no-cache protoc
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables that must be set during build,
# so that they are available in the bundles.
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL $NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN $NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_BYTEBIN_URL
ENV NEXT_PUBLIC_BYTEBIN_URL $NEXT_PUBLIC_BYTEBIN_URL
ARG NEXT_PUBLIC_MAPPINGS_URL
ENV NEXT_PUBLIC_MAPPINGS_URL $NEXT_PUBLIC_MAPPINGS_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSOCKETS_URL
ENV NEXT_PUBLIC_WEBSOCKETS_URL $NEXT_PUBLIC_WEBSOCKETS_URL
ARG DOCS_URL
ENV DOCS_URL $DOCS_URL
ARG THUMBNAIL_SERVICE_URL
ENV THUMBNAIL_SERVICE_URL $THUMBNAIL_SERVICE_URL
ARG JSON_SERVICE_URL
ENV JSON_SERVICE_URL $JSON_SERVICE_URL

RUN yarn build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
