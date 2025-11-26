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
