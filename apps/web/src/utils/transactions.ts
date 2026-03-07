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
