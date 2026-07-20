# Stage 1: Build the React Application
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/

# Install all dependencies (including devDependencies needed for build)
RUN npm ci --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production mode
ENV NODE_ENV production

# We only need the start script and the built client files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/start.js ./
COPY --from=builder /app/apps/web/build ./apps/web/build

# Install serve globally for the runtime
RUN npm install -g serve

EXPOSE 30055
ENV PORT 30055

# Run start.js in production mode
ENTRYPOINT ["node", "start.js", "--run-prod"]

