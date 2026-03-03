import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { category } from "./schema";

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));

const systemCategories: (typeof category.$inferInsert)[] = [
  // Expense
  { id: randomUUID(), userId: null, name: "Food", icon: "🍔", type: "expense" },
  { id: randomUUID(), userId: null, name: "Transport", icon: "🚗", type: "expense" },
  { id: randomUUID(), userId: null, name: "Rent", icon: "🏠", type: "expense" },
  { id: randomUUID(), userId: null, name: "Shopping", icon: "🛍️", type: "expense" },
  { id: randomUUID(), userId: null, name: "Utilities", icon: "💡", type: "expense" },
  { id: randomUUID(), userId: null, name: "Entertainment", icon: "🎬", type: "expense" },
  // Income
  { id: randomUUID(), userId: null, name: "Salary", icon: "💰", type: "income" },
  { id: randomUUID(), userId: null, name: "Freelance", icon: "💻", type: "income" },
  { id: randomUUID(), userId: null, name: "Business", icon: "🏢", type: "income" },
  { id: randomUUID(), userId: null, name: "Investment", icon: "📈", type: "income" },
  { id: randomUUID(), userId: null, name: "Other", icon: "📦", type: "income" },
];

async function seed() {
  console.log("Seeding system categories...");
  await db.insert(category).values(systemCategories).onConflictDoNothing();
  console.log(`Seeded ${systemCategories.length} system categories.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
