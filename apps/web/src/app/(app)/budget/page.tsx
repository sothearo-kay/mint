"use client";

import type { FilterValue } from "@/features/transactions/components/transaction-filters";
import { Cancel01Icon, Coins01Icon, MoneyNotFoundIcon, PencilEdit02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@mint/ui/components/input-group";
import { Separator } from "@mint/ui/components/ui/separator";
import { cn } from "@mint/ui/lib/utils";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useTransactions } from "@/features/transactions/api/get-transactions";
import { DEFAULT_FILTERS, TransactionFilters } from "@/features/transactions/components/transaction-filters";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatNumber } from "@/utils/format";

function fmt(amount: number) {
  return formatNumber(amount, { style: "currency", currency: "USD" });
}

export default function BudgetPage() {
  const [filters, setFilters] = useState<FilterValue>({
    from: DEFAULT_FILTERS.from,
    to: DEFAULT_FILTERS.to,
  });
  const [limit, setLimit] = useLocalStorage<number | null>("budget-limit", null);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: transactions = [], isPending } = useTransactions({
    params: { from: filters.from, to: filters.to },
  });

  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);

  const totalExpense = transactions
    .filter(tx => tx.type === "expense")
    .reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);

  const effectiveLimit = limit ?? totalIncome;
  const pct = effectiveLimit > 0 ? Math.min((totalExpense / effectiveLimit) * 100, 100) : 0;
  const isOverBudget = limit != null && totalExpense > limit;

  const categoryMap = new Map<string, { name: string; icon: string; amount: number }>();
  for (const tx of transactions.filter(tx => tx.type === "expense")) {
    const existing = categoryMap.get(tx.category.id);
    if (existing) {
      existing.amount += Number.parseFloat(tx.amount);
    }
    else {
      categoryMap.set(tx.category.id, {
        name: tx.category.name,
        icon: tx.category.icon,
        amount: Number.parseFloat(tx.amount),
      });
    }
  }
  const categories = [...categoryMap.values()].sort((a, b) => b.amount - a.amount);

  function startEditing() {
    setInputValue(limit?.toString() ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function saveLimit() {
    const val = Number.parseFloat(inputValue);
    setLimit(inputValue === "" || Number.isNaN(val) ? null : val);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter")
      saveLimit();
    if (e.key === "Escape")
      setEditing(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <TransactionFilters showType={false} onChangeAction={setFilters} />
      </div>

      {isPending
        ? (
            <>
              <SummarySkeleton />
              <CategorySkeleton />
            </>
          )
        : (
            <>
              <div className="space-y-3 pb-5 border-b-2 border-border/60 border-dashed">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Monthly Spend</p>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {Math.round(pct)}
                    %
                  </span>
                </div>

                <div className="flex gap-1.5 h-10">
                  {pct > 0 && (
                    <div
                      className="h-full rounded-xl bg-primary bg-stripe shrink-0 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  {pct > 0 && pct < 100 && (
                    <Separator orientation="vertical" className="data-vertical:self-center data-vertical:w-1 data-vertical:h-8 data-vertical:rounded-full" />
                  )}
                  <div className="flex-1 h-full rounded-xl bg-muted bg-stripe-muted" />
                </div>

                <div className="flex items-center justify-end gap-2">
                  {editing
                    ? (
                        <>
                          <InputGroup className="w-32 rounded-full border-0 bg-muted has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent">
                            <InputGroupAddon>
                              <InputGroupText>$</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                              ref={inputRef}
                              type="text"
                              inputMode="decimal"
                              value={inputValue}
                              onChange={e => setInputValue(e.target.value.replace(/[^0-9.]/g, ""))}
                              onKeyDown={handleKeyDown}
                              placeholder="0.00"
                              className="text-xs tabular-nums"
                            />
                          </InputGroup>
                          <Button type="button" size="icon" variant="secondary" onClick={saveLimit} className="rounded-full bg-foreground text-background hover:bg-foreground/90 transition-none">
                            <Icon icon={Tick02Icon} />
                          </Button>
                          <Button type="button" size="icon" variant="secondary" onClick={() => setEditing(false)} className="rounded-full">
                            <Icon icon={Cancel01Icon} />
                          </Button>
                        </>
                      )
                    : (
                        <>
                          <p className={cn("text-xs text-muted-foreground", isOverBudget && "text-destructive")}>
                            {fmt(totalExpense)}
                            {" out of "}
                            {fmt(effectiveLimit)}
                            {" "}
                            {limit ? "limit" : "earned"}
                          </p>
                          <Button type="button" size="icon-xs" variant="ghost" onClick={startEditing} className="size-auto text-muted-foreground/50 hover:bg-transparent hover:text-foreground transition-none">
                            <Icon icon={PencilEdit02Icon} />
                          </Button>
                        </>
                      )}
                </div>
              </div>

              {transactions.length === 0
                ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <div className="size-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
                        <Icon icon={Coins01Icon} className="size-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No transactions</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nothing recorded for
                        {" "}
                        {format(new Date(filters.from), "MMMM yyyy")}
                        .
                      </p>
                    </div>
                  )
                : categories.length === 0
                  ? (
                      <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="size-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
                          <Icon icon={MoneyNotFoundIcon} className="size-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">No expenses</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No spending recorded for
                          {" "}
                          {format(new Date(filters.from), "MMMM yyyy")}
                          .
                        </p>
                      </div>
                    )
                  : (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground px-0.5 mb-3">
                          Spending by Category
                        </p>
                        <div className="space-y-3.5">
                          {categories.map((cat) => {
                            const catPct = totalExpense > 0
                              ? Math.round((cat.amount / totalExpense) * 100)
                              : 0;
                            return (
                              <div key={cat.name} className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                                  <DynamicIcon name={cat.icon} className="size-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                                    <span className="text-sm font-semibold tabular-nums text-foreground shrink-0">
                                      {fmt(cat.amount)}
                                    </span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-primary transition-all duration-500"
                                      style={{ width: `${catPct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
            </>
          )}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-3 pb-5 border-b border-border/60">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-muted rounded-full animate-pulse" />
        <div className="h-3 w-6 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
      <div className="h-3 w-44 bg-muted rounded-full animate-pulse ml-auto" />
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-36 bg-muted rounded-full animate-pulse mb-3" />
      <div className="space-y-3.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-24 bg-muted rounded-full animate-pulse" />
                <div className="h-3.5 w-14 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
