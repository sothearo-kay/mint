"use client";

import type { IconSvgElement } from "@hugeicons/react";
import type { Currency } from "@/utils/constants";
import { Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { MintCard } from "@/components/card";
import { formatBalanceAmount } from "@/utils/format";
import { MonthlyBars, useMonthlyDisplay, ValueSkeleton } from "./monthly-bars";

type InsightSummaryCardProps = {
  title: string;
  icon: IconSvgElement;
  values: number[];
  color: string;
  currency: Currency;
  selectedYear: number;
  prevDecemberValue?: number;
  isPending?: boolean;
  invertChange?: boolean;
};

export function InsightSummaryCard({
  title,
  icon,
  values,
  color,
  currency,
  selectedYear,
  prevDecemberValue,
  isPending,
  invertChange = false,
}: InsightSummaryCardProps) {
  const { currentMonth, displayIndex, onHover, onLeave } = useMonthlyDisplay(selectedYear);

  const displayValue = values[displayIndex] ?? 0;
  const prevValue = displayIndex === 0
    ? (prevDecemberValue ?? null)
    : (values[displayIndex - 1] ?? null);
  const change = prevValue != null && prevValue !== 0
    ? ((displayValue - prevValue) / Math.abs(prevValue)) * 100
    : null;

  return (
    <MintCard
      title={(
        <>
          <Icon icon={icon} className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </>
      )}
    >
      <div className="flex flex-col gap-3">
        <div>
          {isPending
            ? <ValueSkeleton />
            : (
                <>
                  <p className="text-2xl font-bold tabular-nums">{formatBalanceAmount(displayValue, currency)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {change != null
                      ? (
                          <>
                            <span className={cn((invertChange ? change <= 0 : change >= 0) ? "text-primary" : "text-destructive")}>
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
          count={values.length}
          displayIndex={displayIndex}
          currentMonth={currentMonth}
          selectedYear={selectedYear}
          color={color}
          onHoverAction={onHover}
          onLeaveAction={onLeave}
        />
      </div>
    </MintCard>
  );
}
