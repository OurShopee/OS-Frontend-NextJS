FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat curl

ARG profile="prod" 
WORKDIR /app

COPY package.json package-lock.json ./

RUN if [ "$profile" = "prod" ]; then \
    npm ci --omit=dev --force; \
    else \
    npm ci --force; \
    fi

COPY  --chown=node:node . .

ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_BACKEND_API
ARG NEXT_PUBLIC_UAE_URL
ARG NEXT_PUBLIC_OMAN_URL
ARG NEXT_PUBLIC_QATAR_URL
ARG NEXT_PUBLIC_KUWAIT_URL
ARG NEXT_PUBLIC_BAHRAIN_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_S3_PREFIX
ARG NEXT_PUBLIC_TAMARA_PUBLIC_KEY
ARG NEXT_PUBLIC_SAUDI_URL
ARG NEXT_PUBLIC_MULTILANG_REQUIRED
ARG NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY
ARG NEXT_PUBLIC_SALE_LIVE
ARG NEXT_PUBLIC_IMAGE_ASSETS

# Disable Next.js telemetry collection
ENV NEXT_TELEMETRY_DISABLED=1
RUN CI=false NODE_OPTIONS="--max-old-space-size=4096" npm run build

RUN mkdir -p /app/logs && chown -R node:node /app/logs /app/.next

# Set NODE_ENV for runtime
ENV PORT=3000

# Run as the predefined non-root user
USER node 
EXPOSE 3000

# Command to start the application using PM2
CMD ["npm", "start"]