import type { Currency } from "@/utils/constants";

export const KHR_PER_USD = 4000;

export function toUSD(amount: number, currency: string): number {
  return currency === "USD" ? amount : amount / KHR_PER_USD;
}

export function sumByCurrency(transactions: { type: string; amount: string; currency: string }[]) {
  const map = new Map<string, { income: number; expense: number }>();
  for (const tx of transactions) {
    if (!map.has(tx.currency))
      map.set(tx.currency, { income: 0, expense: 0 });
    const entry = map.get(tx.currency)!;
    const amount = Number.parseFloat(tx.amount);
    if (tx.type === "income")
      entry.income += amount;
    else
      entry.expense += amount;
  }
  // Return USD first, then KHR (always both)
  const order = ["USD", "KHR"];
  return order.map((c) => {
    const { income, expense } = map.get(c) ?? { income: 0, expense: 0 };
    return { currency: c as Currency, income, expense, balance: income - expense };
  });
}

export function sumByType(transactions: { type: string; amount: string }[]) {
  return transactions.reduce(
    (acc, tx) => {
      const amount = Number.parseFloat(tx.amount);
      if (tx.type === "income")
        acc.income += amount;
      else
        acc.expense += amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );
}
