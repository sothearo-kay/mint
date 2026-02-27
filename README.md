# Mint

A minimalist expense tracker. Built with Next.js, Hono, and Turborepo.

## Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS v4, next-themes
- **Backend** — Hono, @hono/zod-openapi, Scalar API docs
- **Shared** — TypeScript project references, pnpm catalogs, Turborepo

## Structure

```
apps/
  web/        Next.js frontend (port 3000)
  server/     Hono API server (port 8080)

packages/
  ui/         Shared component library (shadcn, Tailwind v4, Base UI)
  api-client/ Type-safe Hono RPC client
  env/        Centralized env validation (t3-env)
  eslint-config/  Shared ESLint config (antfu)
```

## Getting started

Ensure you're on the correct Node version (v22.12.0):

```sh
nvm install  # first time only
nvm use
```

Then install dependencies:

```sh
pnpm install
```

Copy the example env files:

```sh
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
```

## Development

```sh
pnpm dev
```

Runs all apps in parallel via Turborepo. Or run individually:

```sh
pnpm dev --filter=web
pnpm dev --filter=server
```

## Other commands

```sh
pnpm build         # build all apps
pnpm lint          # lint all packages
pnpm check-types   # type-check all packages
```
