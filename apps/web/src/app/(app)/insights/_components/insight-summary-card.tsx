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
  isPending?: boolean;
  invertChange?: boolean;
};

export function InsightSummaryCard({
  title,
  icon,
  values,
  color,
  currency,
  isPending,
  invertChange = false,
}: InsightSummaryCardProps) {
  const { currentMonth, displayIndex, onHover, onLeave } = useMonthlyDisplay();

  const displayValue = values[displayIndex] ?? 0;
  const prevValue = values[Math.max(displayIndex - 1, 0)] ?? 0;
  const change = prevValue !== 0 ? ((displayValue - prevValue) / Math.abs(prevValue)) * 100 : 0;

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
                    <span className={cn((invertChange ? change <= 0 : change >= 0) ? "text-primary" : "text-destructive")}>
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
          count={values.length}
          displayIndex={displayIndex}
          currentMonth={currentMonth}
          color={color}
          onHoverAction={onHover}
          onLeaveAction={onLeave}
        />
      </div>
    </MintCard>
  );
}
