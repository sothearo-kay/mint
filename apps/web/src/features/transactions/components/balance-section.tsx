"use client";

import { Separator } from "@mint/ui/components/ui/separator";
import { format } from "date-fns";
import { formatNumber } from "@/utils/format";

type BalanceProps = {
  isPending: boolean;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  from: string;
};

export function Balance({ isPending, balance, totalIncome, totalExpense, from }: BalanceProps) {
  return (
    <div className="pb-6 border-b-2 border-dashed border-border/60">
      <p className="text-xs text-muted-foreground mb-1">
        Balance
        <span className="inline-block mx-2">{" · "}</span>
        {format(new Date(from), "MMMM yyyy")}
      </p>
      {isPending
        ? <BalanceSkeleton />
        : (
            <>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {formatNumber(balance, { style: "currency", currency: "USD" })}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Income</p>
                  <p className="text-sm font-semibold tabular-nums text-primary">
                    {totalIncome > 0 ? "+" : ""}
                    {formatNumber(totalIncome, { style: "currency", currency: "USD" })}
                  </p>
                </div>
                <Separator orientation="vertical" className="data-vertical:h-6 data-vertical:self-center" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Expenses</p>
                  <p className="text-sm font-semibold tabular-nums text-destructive">
                    {totalExpense > 0 ? "-" : ""}
                    {formatNumber(totalExpense, { style: "currency", currency: "USD" })}
                  </p>
                </div>
              </div>
            </>
          )}
    </div>
  );
}

function BalanceSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <div className="h-3 w-10 bg-muted rounded-full animate-pulse" />
          <div className="h-4.5 w-20 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="w-px h-6 bg-muted" />
        <div className="space-y-1">
          <div className="h-3 w-12 bg-muted rounded-full animate-pulse" />
          <div className="h-4.5 w-20 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
