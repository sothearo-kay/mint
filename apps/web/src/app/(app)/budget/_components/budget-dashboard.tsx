"use client";

import type { FilterValue } from "@/features/transactions/components/transaction-filters";
import type { Currency } from "@/utils/constants";
import { useState } from "react";
import { CurrencyToggle } from "@/components/currency-toggle";
import { ErrorState } from "@/components/error-state";
import { useSession } from "@/features/auth/api";
import { useCategorySummary } from "@/features/categories/api/get-summary";
import { useSettings } from "@/features/settings/api/get-settings";
import { DEFAULT_FILTERS, TransactionFilters } from "@/features/transactions/components/transaction-filters";
import { useFilteredGuestTransactions } from "@/store/guest-transactions";
import { sumByType } from "@/utils/transactions";
import { CategoryBreakdown } from "./category-breakdown";
import { MonthlySpend } from "./monthly-spend";

export function BudgetDashboard() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<FilterValue>({
    from: DEFAULT_FILTERS.from,
    to: DEFAULT_FILTERS.to,
  });
  const [currency, setCurrency] = useState<Currency>("USD");

  const { data: settingsData } = useSettings({ queryConfig: { enabled: !!session } });
  const rawLimit = currency === "USD" ? settingsData?.budgetLimitUSD : settingsData?.budgetLimitKHR;
  const limit = rawLimit ? Number.parseFloat(rawLimit) : null;

  const { transactions: guestTxs, hasHydrated } = useFilteredGuestTransactions(filters.from, filters.to, currency);

  const { data: summaryData, isPending: isSummaryPending, isPlaceholderData, isError } = useCategorySummary({
    params: { from: filters.from, to: filters.to, currency },
    queryConfig: { enabled: !!session },
  });
  const isPending = session ? isSummaryPending : !hasHydrated;

  const { income: guestIncome, expense: guestExpense } = sumByType(guestTxs);
  const totalIncome = session ? Number.parseFloat(summaryData?.income ?? "0") : guestIncome;
  const totalExpense = session ? Number.parseFloat(summaryData?.expense ?? "0") : guestExpense;

  const categories = session
    ? (summaryData?.categories ?? [])
    : Object.values(
        guestTxs
          .filter(tx => tx.type === "expense")
          .reduce<Record<string, { id: string; name: string; icon: string; amount: number }>>((acc, tx) => {
            const { id, name, icon } = tx.category;
            acc[id] = { id, name, icon, amount: (acc[id]?.amount ?? 0) + Number.parseFloat(tx.amount) };
            return acc;
          }, {}),
      ).map(c => ({ ...c, amount: String(c.amount) })).sort((a, b) => Number.parseFloat(b.amount) - Number.parseFloat(a.amount));

  const effectiveLimit = limit ?? totalIncome;
  const pct = effectiveLimit > 0 ? Math.min((totalExpense / effectiveLimit) * 100, 100) : totalExpense > 0 ? 100 : 0;
  const isOverBudget = limit != null ? totalExpense > limit : totalExpense > 0 && totalExpense > totalIncome;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <CurrencyToggle value={currency} onChangeAction={setCurrency} />
        <TransactionFilters showType={false} isFetching={!!session && isPlaceholderData} onChangeAction={setFilters} />
      </div>

      {isError
        ? <ErrorState />
        : (
            <div className="flex flex-col gap-6">
              <MonthlySpend
                isPending={isPending}
                pct={pct}
                isOverBudget={isOverBudget}
                totalExpense={totalExpense}
                effectiveLimit={effectiveLimit}
                limit={limit}
                currency={currency}
                canEdit={!!session}
              />
              <CategoryBreakdown
                isPending={isPending}
                categories={categories}
                totalExpense={totalExpense}
                totalIncome={totalIncome}
                from={filters.from}
              />
            </div>
          )}
    </div>
  );
}
