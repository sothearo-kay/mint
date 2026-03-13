"use client";

import type { MonthlyBreakdown } from "@/features/insights/api/get-breakdown";
import type { MonthlyInsight, PrevDecember } from "@/features/insights/api/get-insights";
import type { Currency } from "@/utils/constants";
import { PiggyBankIcon } from "@hugeicons/core-free-icons";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { MintCard } from "@/components/card";
import { MONTHS } from "@/utils/constants";
import { formatBalanceAmount } from "@/utils/format";
import { MonthlyBars, useMonthlyDisplay, ValueSkeleton } from "./monthly-bars";

type SavingsRateCardProps = {
  monthly: MonthlyInsight[];
  breakdown: MonthlyBreakdown[];
  currency: Currency;
  selectedYear: number;
  prevDecember?: PrevDecember;
  isPending?: boolean;
};

export function SavingsRateCard({
  monthly,
  breakdown,
  currency,
  selectedYear,
  prevDecember,
  isPending,
}: SavingsRateCardProps) {
  const { currentMonth, displayIndex, onHover, onLeave } = useMonthlyDisplay(selectedYear);

  const m = monthly[displayIndex];
  const savings = m?.balance ?? 0;
  const rate = (m?.income ?? 0) > 0 ? (savings / m!.income) * 100 : 0;

  const prevM = displayIndex === 0 ? null : monthly[displayIndex - 1];
  const prevSavings = displayIndex === 0 ? (prevDecember?.balance ?? null) : (prevM?.balance ?? null);
  const prevIncome = displayIndex === 0 ? (prevDecember?.income ?? null) : (prevM?.income ?? null);
  const prevRate = prevIncome != null && prevIncome > 0 && prevSavings != null ? (prevSavings / prevIncome) * 100 : null;
  const change = prevRate != null && prevRate !== 0 ? rate - prevRate : null;

  const incomeCategories = breakdown[displayIndex]?.incomeCategories ?? [];
  const totalIncome = incomeCategories.reduce((s, c) => s + Number.parseFloat(c.amount), 0);

  return (
    <MintCard title={(
      <>
        <Icon icon={PiggyBankIcon} className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Savings Rate</span>
      </>
    )}
    >
      <div className="flex flex-col gap-4">
        <div>
          {isPending
            ? <ValueSkeleton />
            : (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold tabular-nums">
                      {rate.toFixed(1)}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {formatBalanceAmount(savings, currency)}
                      {" "}
                      saved
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {change != null
                      ? (
                          <>
                            <span className={cn(change >= 0 ? "text-primary" : "text-destructive")}>
                              {change >= 0 ? "+" : ""}
                              {change.toFixed(1)}
                              %
                            </span>
                            {" from last month"}
                          </>
                        )
                      : "No previous data"}
                  </p>
                </>
              )}
        </div>

        <MonthlyBars
          count={monthly.length}
          displayIndex={displayIndex}
          currentMonth={currentMonth}
          selectedYear={selectedYear}
          onHoverAction={onHover}
          onLeaveAction={onLeave}
        />

        {!isPending && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground font-medium">
              Income
              <span className="inline-block mx-1.5">·</span>
              {MONTHS[displayIndex]}
            </p>
            {incomeCategories.length === 0
              ? (
                  <p className="text-xs text-muted-foreground">No income recorded</p>
                )
              : incomeCategories.map((cat) => {
                  const amount = Number.parseFloat(cat.amount);
                  const pct = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                  return (
                    <div key={cat.id} className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <DynamicIcon name={cat.icon} className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-xs font-medium truncate">{cat.name}</p>
                          <span className="text-xs tabular-nums text-muted-foreground shrink-0">{formatBalanceAmount(amount, currency)}</span>
                        </div>
                        <div className="h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </div>
    </MintCard>
  );
}
