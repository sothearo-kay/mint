"use client";

import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { useState } from "react";

export function useMonthlyDisplay() {
  const currentMonth = new Date().getMonth();
  const [displayIndex, setDisplayIndex] = useState(currentMonth);
  return {
    currentMonth,
    displayIndex,
    onHover: (i: number) => setDisplayIndex(i),
    onLeave: () => setDisplayIndex(currentMonth),
  };
}

type MonthlyBarsProps = {
  count: number;
  displayIndex: number;
  currentMonth: number;
  color?: string;
  onHoverAction: (i: number) => void;
  onLeaveAction: () => void;
};

export function MonthlyBars({ count, displayIndex, currentMonth, color = "bg-primary", onHoverAction, onLeaveAction }: MonthlyBarsProps) {
  return (
    <div className="flex items-end gap-1.5 h-10" onMouseLeave={onLeaveAction}>
      {Array.from({ length: count }, (_, i) => {
        const isFuture = i > currentMonth;
        const isPast = i < currentMonth;
        const isActive = displayIndex === i;
        return (
          <div
            key={i}
            className={cn("flex-1 max-w-3 flex items-end h-full", !isFuture && "cursor-pointer")}
            onMouseEnter={() => !isFuture && onHoverAction(i)}
          >
            <div
              className={cn(
                "size-full rounded-sm transition-colors duration-75",
                isFuture && "bg-muted",
                isPast && !isActive && `${color} opacity-30`,
                isPast && isActive && color,
                !isPast && !isFuture && (isActive ? color : "bg-muted"),
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ValueSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-28 rounded-full" />
      <Skeleton className="h-3 w-32 rounded-full mt-1.5" />
    </>
  );
}
