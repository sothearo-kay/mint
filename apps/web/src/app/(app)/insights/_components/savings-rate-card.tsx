"use client";

import type { MonthlyBreakdown } from "@/features/insights/api/get-breakdown";
import type { MonthlyInsight } from "@/features/insights/api/get-insights";
import type { Currency } from "@/utils/constants";
import { PiggyBankIcon } from "@hugeicons/core-free-icons";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { MONTHS } from "@/utils/constants";
import { formatBalanceAmount } from "@/utils/format";
import { InsightCard } from "./insight-card";
import { MonthlyBars, useMonthlyDisplay, ValueSkeleton } from "./monthly-bars";

type SavingsRateCardProps = {
  monthly: MonthlyInsight[];
  breakdown: MonthlyBreakdown[];
  currency: Currency;
  isPending?: boolean;
};

export function SavingsRateCard({ monthly, breakdown, currency, isPending }: SavingsRateCardProps) {
  const { currentMonth, displayIndex, onHover, onLeave } = useMonthlyDisplay();

  const m = monthly[displayIndex];
  const savings = (m?.income ?? 0) - (m?.expense ?? 0);
  const rate = (m?.income ?? 0) > 0 ? (savings / m!.income) * 100 : 0;

  const prevM = monthly[Math.max(displayIndex - 1, 0)];
  const prevSavings = (prevM?.income ?? 0) - (prevM?.expense ?? 0);
  const prevRate = (prevM?.income ?? 0) > 0 ? (prevSavings / prevM!.income) * 100 : 0;
  const change = prevRate !== 0 ? rate - prevRate : 0;

  const incomeCategories = breakdown[displayIndex]?.incomeCategories ?? [];
  const totalIncome = incomeCategories.reduce((s, c) => s + Number.parseFloat(c.amount), 0);

  return (
    <InsightCard title={(
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
                    <span className={cn(change >= 0 ? "text-primary" : "text-destructive")}>
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(1)}
                      %
                    </span>
                    {" from last month"}
                  </p>
                </>
              )}
        </div>

        <MonthlyBars
          count={monthly.length}
          displayIndex={displayIndex}
          currentMonth={currentMonth}
          onHoverAction={onHover}
          onLeaveAction={onLeave}
        />

        {!isPending && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground font-medium">
              Income
              {" "}
              <span className="inline-block mx-0.5">{" · "}</span>
              {" "}
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
    </InsightCard>
  );
}
