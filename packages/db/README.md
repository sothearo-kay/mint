# @mint/db

Database package for Mint. Provides a shared Drizzle ORM client and schema used by `apps/server`.

## Stack

- **[Drizzle ORM](https://orm.drizzle.team)** — TypeScript ORM, thin layer over SQL
- **[drizzle-kit](https://orm.drizzle.team/kit-docs/overview)** — CLI for generating and running migrations
- **PostgreSQL** via the `pg` driver

---

## Setup

### 1. Set the environment variable

Copy `.env.example` to `.env` and fill in `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/mint
```

Drizzle-kit auto-loads `.env` from this directory — no manual sourcing needed.

### 2. Push the schema to the database

```bash
pnpm --filter @mint/db db:push
```

`push` directly syncs your schema to the database without creating migration files. Good for development.

---

## Drizzle concepts

### Schema (`src/schema.ts`)

Defines tables as TypeScript objects. Example of what better-auth generates:

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
});
```

### Client (`src/index.ts`)

Creates a connection pool and wraps it with Drizzle:

```ts
const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

### Querying

Import `db` wherever you need database access (only in `apps/server`):

```ts
import { db } from "@mint/db";
import { user } from "@mint/db/schema";

// Select all users
const users = await db.select().from(user);

// Select with filter
const found = await db.select().from(user).where(eq(user.email, "a@b.com"));

// Insert
await db
  .insert(user)
  .values({ id: "1", name: "Alice", email: "a@b.com", createdAt: new Date() });
```

---

## drizzle-kit commands

Run these from the repo root with `pnpm --filter @mint/db <script>`, or from inside `packages/db` with `pnpm <script>`.

| Script        | What it does                                     |
| ------------- | ------------------------------------------------ |
| `db:push`     | Sync schema to DB directly (dev only)            |
| `db:generate` | Generate SQL migration files from schema changes |
| `db:migrate`  | Apply pending migration files                    |
| `db:studio`   | Open a browser UI to browse your database        |

All scripts pass `--env-file ../../apps/server/.env` to drizzle-kit automatically.

**push vs migrate:** Use `push` while actively developing the schema. Switch to `generate` + `migrate` once the schema is stable or in production — it creates versioned `.sql` files under `./drizzle` that can be reviewed and committed.
