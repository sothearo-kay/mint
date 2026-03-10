"use client";

import type { RecurringTransaction } from "@/features/recurring/api/get-recurring";
import type { Currency } from "@/utils/constants";
import { ArrowDownLeft01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { RecurringSummaryCard } from "@/features/recurring/components/recurring-summary-card";

type Frequency = "all" | RecurringTransaction["frequency"];

const MONTHLY_MULT: Record<RecurringTransaction["frequency"], number> = {
  daily: 30,
  weekly: 52 / 12,
  monthly: 1,
  yearly: 1 / 12,
};

const PERIOD_LABEL: Record<Frequency, string | null> = {
  all: null,
  daily: "/ day",
  weekly: "/ week",
  monthly: "/ month",
  yearly: "/ year",
};

function computeTotal(
  items: RecurringTransaction[],
  type: "income" | "expense",
  frequency: Frequency,
): number {
  return items
    .filter(r => r.type === type)
    .reduce((sum, r) => {
      const amount = Number.parseFloat(r.amount);
      return sum + (frequency === "all" ? amount * MONTHLY_MULT[r.frequency] : amount);
    }, 0);
}

type RecurringSummaryProps = {
  recurring: RecurringTransaction[];
  currency: Currency;
  frequency: Frequency;
  isPending: boolean;
};

export function RecurringSummary({ recurring, currency, frequency, isPending }: RecurringSummaryProps) {
  const periodLabel = PERIOD_LABEL[frequency];

  return (
    <div className="grid sm:grid-cols-2 gap-x-3 gap-y-4">
      <RecurringSummaryCard
        title="Income"
        icon={ArrowDownLeft01Icon}
        total={computeTotal(recurring, "income", frequency)}
        count={recurring.filter(r => r.type === "income").length}
        currency={currency}
        periodLabel={periodLabel}
        isPending={isPending}
        valueClassName="text-primary"
      />
      <RecurringSummaryCard
        title="Expenses"
        icon={ArrowUpRight01Icon}
        total={computeTotal(recurring, "expense", frequency)}
        count={recurring.filter(r => r.type === "expense").length}
        currency={currency}
        periodLabel={periodLabel}
        isPending={isPending}
        valueClassName="text-destructive"
      />
    </div>
  );
}
