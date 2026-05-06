FROM oven/bun:latest

WORKDIR /app

ARG DATABASE_URL
ARG FRONTEND_URL

ENV DATABASE_URL=$DATABASE_URL
ENV FRONTEND_URL=$FRONTEND_URL

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bun run prisma:generate

COPY . .

EXPOSE 3001

CMD ["bun", "run", "start"]
