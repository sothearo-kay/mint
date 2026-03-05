import type { CreateRoute, ListRoute, RemoveRoute, ResetRoute } from "./categories.routes";
import type { AppRouteHandler } from "@/lib/types";
import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { category } from "@mint/db/schema";
import { asc, eq, isNull, or, sql } from "drizzle-orm";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user;

  const categories = await db
    .select()
    .from(category)
    .where(
      user
        ? or(isNull(category.userId), eq(category.userId, user.id))
        : isNull(category.userId),
    )
    .orderBy(
      category.type,
      sql`${category.userId} is not null`,
      asc(category.name),
    );

  return c.json(
    categories.map(cat => ({
      ...cat,
      createdAt: cat.createdAt.toISOString(),
    })),
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  const [created] = await db
    .insert(category)
    .values({
      id: randomUUID(),
      userId: user.id,
      name: body.name,
      icon: body.icon,
      type: body.type,
    })
    .returning();

  return c.json({ ...created, createdAt: created.createdAt.toISOString() }, 201);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [existing] = await db.select().from(category).where(eq(category.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId === null)
    return c.json({ message: "Cannot delete a system category" }, 403);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.delete(category).where(eq(category.id, id));

  return c.body(null, 204);
};

export const reset: AppRouteHandler<ResetRoute> = async (c) => {
  const user = c.var.user!;

  await db.delete(category).where(eq(category.userId, user.id));

  return c.body(null, 204);
};
