"use client";

import type { Currency } from "@/utils/constants";
import { format } from "date-fns";
import { BalanceDisplay, BalanceDisplaySkeleton } from "@/components/balance-display";
import { PieTooltip } from "@/components/pie-tooltip";
import { formatBalanceAmount } from "@/utils/format";
import { toUSD } from "@/utils/transactions";

export type CurrencyBalance = {
  currency: Currency;
  income: number;
  expense: number;
  balance: number;
};

type TransactionBalanceProps = {
  isPending: boolean;
  currencies: CurrencyBalance[];
  from: string;
};

const DONUT_COLORS = ["var(--income)", "var(--expense)"];

export function TransactionBalance({ isPending, currencies, from }: TransactionBalanceProps) {
  const formattedDate = format(new Date(from), "MMMM yyyy");

  const normalizedIncome = currencies.reduce((s, c) => s + toUSD(c.income, c.currency), 0);
  const normalizedExpense = currencies.reduce((s, c) => s + toUSD(c.expense, c.currency), 0);
  const hasActivity = normalizedIncome > 0 || normalizedExpense > 0;

  const chartData = hasActivity
    ? [
        { id: "income", name: "Income", value: normalizedIncome },
        { id: "expense", name: "Expense", value: normalizedExpense },
      ].filter(d => d.value > 0)
    : [{ id: "empty", name: "", value: 1 }];

  const labelMap: Record<string, string[]> = {
    Income: currencies.filter(c => c.income > 0).map(c => formatBalanceAmount(c.income, c.currency)),
    Expense: currencies.filter(c => c.expense > 0).map(c => formatBalanceAmount(c.expense, c.currency)),
  };

  const label = (
    <>
      Balance
      <span className="inline-block mx-2">·</span>
      {formattedDate}
    </>
  );

  const items = currencies.length > 0
    ? currencies.map(c => formatBalanceAmount(c.balance, c.currency))
    : ["$0.00"];

  return (
    <div className="pb-6 border-b border-dashed">
      {isPending
        ? <BalanceDisplaySkeleton label={label} />
        : (
            <BalanceDisplay
              label={label}
              items={items}
              chartData={chartData}
              chartColors={hasActivity ? DONUT_COLORS : ["var(--border)"]}
              hideTooltip={!hasActivity}
              tooltipContent={<PieTooltip labelMap={labelMap} />}
            />
          )}
    </div>
  );
}
