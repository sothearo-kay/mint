import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { category } from "./schema";

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));

const systemCategories: (typeof category.$inferInsert)[] = [
  // Expense
  { id: randomUUID(), userId: null, name: "Food", icon: "Restaurant01Icon", type: "expense" },
  { id: randomUUID(), userId: null, name: "Transport", icon: "Car01Icon", type: "expense" },
  { id: randomUUID(), userId: null, name: "Rent", icon: "Home01Icon", type: "expense" },
  { id: randomUUID(), userId: null, name: "Shopping", icon: "ShoppingBag01Icon", type: "expense" },
  { id: randomUUID(), userId: null, name: "Utilities", icon: "ElectricPlugsIcon", type: "expense" },
  { id: randomUUID(), userId: null, name: "Entertainment", icon: "GameController01Icon", type: "expense" },
  // Income
  { id: randomUUID(), userId: null, name: "Salary", icon: "Money01Icon", type: "income" },
  { id: randomUUID(), userId: null, name: "Freelance", icon: "LaptopChargingIcon", type: "income" },
  { id: randomUUID(), userId: null, name: "Business", icon: "Building01Icon", type: "income" },
  { id: randomUUID(), userId: null, name: "Investment", icon: "Chart01Icon", type: "income" },
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
