"use client";

import type { Currency } from "@/utils/constants";
import { Cancel01Icon, PencilEdit02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@mint/ui/components/input-group";
import { Separator } from "@mint/ui/components/ui/separator";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { useRef, useState } from "react";
import { useUpdateSettings } from "@/features/settings/api/update-settings";
import { formatBalanceAmount } from "@/utils/format";

type MonthlySpendProps = {
  isPending: boolean;
  pct: number;
  isOverBudget: boolean;
  totalExpense: number;
  effectiveLimit: number;
  limit: number | null;
  currency: Currency;
  canEdit: boolean;
};

export function MonthlySpend({ isPending, pct, isOverBudget, totalExpense, effectiveLimit, limit, currency, canEdit }: MonthlySpendProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateSettings } = useUpdateSettings();

  function startEditing() {
    setInputValue(limit?.toString() ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function saveLimit() {
    const val = Number.parseFloat(inputValue);
    const newLimit = inputValue === "" || Number.isNaN(val) ? null : val;
    const limitStr = newLimit !== null ? String(newLimit) : null;
    updateSettings(currency === "USD" ? { budgetLimitUSD: limitStr } : { budgetLimitKHR: limitStr });
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter")
      saveLimit();
    if (e.key === "Escape")
      setEditing(false);
  }

  const symbol = currency === "KHR" ? "៛" : "$";

  if (isPending)
    return <SummarySkeleton />;

  return (
    <div className="space-y-3 pb-6 border-b border-dashed">
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
            className="h-full rounded-xl bg-primary dark:bg-primary/80 bg-stripe shrink-0 transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
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
                    <InputGroupText>{symbol}</InputGroupText>
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
                <Button type="button" size="icon" variant="secondary" onClick={saveLimit} className="rounded-full bg-foreground! text-background! hover:bg-foreground/90 transition-none">
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
                  {formatBalanceAmount(totalExpense, currency)}
                  {" out of "}
                  {formatBalanceAmount(effectiveLimit, currency)}
                  {" "}
                  {limit ? "limit" : "earned"}
                </p>
                {canEdit && (
                  <Button type="button" size="icon-xs" variant="ghost" onClick={startEditing} className="size-auto text-muted-foreground/50 hover:bg-transparent hover:text-foreground transition-none">
                    <Icon icon={PencilEdit02Icon} />
                  </Button>
                )}
              </>
            )}
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-3 pb-5 border-b-2 border-dashed border-border/60">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-3 w-6 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-5 w-44 rounded-full ml-auto" />
    </div>
  );
}
