"use client";

import type { IconSvgElement } from "@hugeicons/react";
import type { Currency } from "@/utils/constants";
import { Icon } from "@mint/ui/components/icon";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { MintCard } from "@/components/card";
import { formatBalanceAmount } from "@/utils/format";

type RecurringSummaryCardProps = {
  title: string;
  icon: IconSvgElement;
  total: number;
  count: number;
  currency: Currency;
  periodLabel: string | null;
  isPending: boolean;
  valueClassName?: string;
};

export function RecurringSummaryCard({ title, icon, total, count, currency, periodLabel, isPending, valueClassName }: RecurringSummaryCardProps) {
  return (
    <MintCard
      title={(
        <>
          <Icon icon={icon} className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </>
      )}
    >
      {isPending
        ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-3.5 w-16 rounded-full" />
            </div>
          )
        : (
            <div className="flex flex-col gap-0.5">
              <p className={cn("text-2xl font-bold tabular-nums", valueClassName)}>
                {formatBalanceAmount(total, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {count}
                {" "}
                {count === 1 ? "item" : "items"}
                {periodLabel ? ` ${periodLabel}` : ""}
              </p>
            </div>
          )}
    </MintCard>
  );
}
