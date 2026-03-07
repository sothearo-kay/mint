"use client";

import type { Currency } from "@/utils/constants";
import { Separator } from "@mint/ui/components/ui/separator";
import { format } from "date-fns";
import { formatBalanceAmount } from "@/utils/format";

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

export function TransactionBalance({ isPending, currencies, from }: TransactionBalanceProps) {
  const isMixed = currencies.length > 1;

  return (
    <div className="pb-6 border-b-2 border-dashed border-border/60">
      <p className="text-xs text-muted-foreground mb-1">
        Balance
        <span className="inline-block mx-2">{" · "}</span>
        {format(new Date(from), "MMMM yyyy")}
      </p>
      {isPending
        ? <TransactionBalanceSkeleton />
        : (
            <div className="flex flex-col">
              {currencies.length === 0
                ? <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">$0.00</p>
                : currencies.map((c, i) => (
                    <div key={c.currency}>
                      {i > 0 && <div className="border-t border-dashed border-border/60 my-3" />}
                      {isMixed && (
                        <p className="text-xs font-medium text-muted-foreground mb-1">{c.currency}</p>
                      )}
                      <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                        {formatBalanceAmount(c.balance, c.currency)}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Income</p>
                          <p className="text-sm font-semibold tabular-nums text-primary">
                            {formatBalanceAmount(c.income, c.currency)}
                          </p>
                        </div>
                        <Separator orientation="vertical" className="data-vertical:h-6 data-vertical:self-center" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Expenses</p>
                          <p className="text-sm font-semibold tabular-nums text-destructive">
                            {formatBalanceAmount(c.expense, c.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
    </div>
  );
}

export function TransactionBalanceSkeleton() {
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
