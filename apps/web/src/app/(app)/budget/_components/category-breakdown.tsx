"use client";

import { Coins01Icon, MoneyNotFoundIcon } from "@hugeicons/core-free-icons";
import { DynamicIcon } from "@mint/ui/components/icon";
import { Progress } from "@mint/ui/components/ui/progress";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { format } from "date-fns";
import { EmptyState } from "@/components/empty-state";
import { useCurrencyStore } from "@/store/currency";
import { formatBalanceAmount } from "@/utils/format";

type Category = {
  id: string;
  name: string;
  icon: string;
  amount: string;
};

type CategoryBreakdownProps = {
  isPending: boolean;
  categories: Category[];
  totalExpense: number;
  totalIncome: number;
  from: string;
};

export function CategoryBreakdown({ isPending, categories, totalExpense, totalIncome, from }: CategoryBreakdownProps) {
  const { currency } = useCurrencyStore();

  if (isPending)
    return <CategorySkeleton />;

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <EmptyState
        icon={Coins01Icon}
        title="No transactions"
        description={`Nothing recorded for ${format(new Date(from), "MMMM yyyy")}.`}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={MoneyNotFoundIcon}
        title="No expenses"
        description={`No spending recorded for ${format(new Date(from), "MMMM yyyy")}.`}
      />
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground px-0.5 mb-3">
        Spending by Category
      </p>
      <div className="space-y-3.5">
        {categories.map((cat) => {
          const catAmount = Number.parseFloat(cat.amount);
          const catPct = totalExpense > 0 ? Math.round((catAmount / totalExpense) * 100) : 0;
          return (
            <div key={cat.id} className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <DynamicIcon name={cat.icon} className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                  <span className="text-sm font-medium tabular-nums text-foreground shrink-0">
                    {formatBalanceAmount(Number.parseFloat(cat.amount), currency)}
                  </span>
                </div>
                <Progress value={catPct} className="**:data-[slot=progress-indicator]:dark:bg-primary/80" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-36 rounded-full mb-3" />
      <div className="space-y-3.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24 rounded-full" />
                <Skeleton className="h-3.5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
