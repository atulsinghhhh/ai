FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

# Build-time environment variables
ARG BUN_PUBLIC_SUPABASE_URL
ARG BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG BUN_PUBLIC_BACKEND_URL

ENV BUN_PUBLIC_SUPABASE_URL=$BUN_PUBLIC_SUPABASE_URL
ENV BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV BUN_PUBLIC_BACKEND_URL=$BUN_PUBLIC_BACKEND_URL

RUN bun run build

# Use a slim image for serving
FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/dist ./dist

# Install a simple server to serve the static files
RUN bun add -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
