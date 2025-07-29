FROM ghcr.io/puppeteer/puppeteer:latest AS base

USER root

RUN apt-get update && apt-get install -y \
    cron \
    curl \
    unzip

RUN curl -fsSL https://bun.sh/install | bash

RUN apt-get purge -y curl unzip \
 && apt-get autoremove -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV BUN_INSTALL=/root/.bun
ENV PATH="$BUN_INSTALL/bin:$PATH"


FROM base as deps

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install


FROM base as build

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules /app/node_modules

RUN bun run build


FROM base

WORKDIR /app

COPY --from=build /app/dist.js .

RUN mkdir -p /etc/cron.d

RUN touch cron.log

RUN echo "*/5 * * * * root cd /app && /root/.bun/bin/bun run dist.js >> cron.log 2>&1" > /etc/cron.d/crontab

RUN chmod 0644 /etc/cron.d/crontab

RUN crontab /etc/cron.d/crontab

CMD cron && tail -f cron.log
