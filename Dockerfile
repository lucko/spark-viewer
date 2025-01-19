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

# client enviroment variables
ARG SPARK_BASE_URL
ARG SPARK_BYTEBIN_URL
ARG SPARK_BYTESOCKS_URL
ARG SPARK_MAPPINGS_URL
ARG SPARK_API_URL

ENV NEXT_PUBLIC_SPARK_BASE_URL=$SPARK_BASE_URL \
    NEXT_PUBLIC_SPARK_BYTEBIN_URL=$SPARK_BYTEBIN_URL \
    NEXT_PUBLIC_SPARK_BYTESOCKS_URL=$SPARK_BYTESOCKS_URL \
    NEXT_PUBLIC_SPARK_MAPPINGS_URL=$SPARK_MAPPINGS_URL \
    NEXT_PUBLIC_SPARK_API_URL=$SPARK_API_URL

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

# server enviroment variables
ARG SPARK_DOCS_URL
ARG SPARK_THUMBNAIL_SERVICE_URL
ARG SPARK_JSON_SERVICE_URL

ENV SPARK_DOCS_URL=$SPARK_DOCS_URL \
    SPARK_THUMBNAIL_SERVICE_URL=$SPARK_THUMBNAIL_SERVICE_URL \
    SPARK_JSON_SERVICE_URL=$SPARK_JSON_SERVICE_URL

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
