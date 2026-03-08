"use client";

import type { PieSlice } from "@mint/ui/components/ui/pie-chart";
import { MintPieChart } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";

type BalanceDisplayProps = {
  label: React.ReactNode;
  items: string[];
  chartData: PieSlice[];
  chartColors?: string[];
  hideTooltip?: boolean;
  tooltipContent?: React.ReactElement;
  showChart?: boolean;
};

export function BalanceDisplay({
  label,
  items,
  chartData,
  chartColors,
  hideTooltip,
  tooltipContent,
  showChart = true,
}: BalanceDisplayProps) {
  return (
    <div className="flex items-center gap-6">
      {showChart && (
        <MintPieChart
          data={chartData}
          colors={chartColors}
          showLegend={false}
          showLabels={false}
          hideTooltip={hideTooltip}
          tooltipContent={tooltipContent}
          className="size-36 shrink-0"
        />
      )}
      <div className="flex flex-col min-w-0 divide-y divide-dashed divide-muted-foreground/30 text-right">
        <div className="flex flex-col gap-1 pb-2">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tabular-nums tracking-tight">{items[0]}</p>
        </div>
        {items[1] && (
          <p className="text-3xl font-bold tabular-nums tracking-tight pt-2">{items[1]}</p>
        )}
      </div>
    </div>
  );
}

export function BalanceDisplaySkeleton({ label }: { label?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="size-36 flex items-center justify-center shrink-0">
        <Skeleton className="size-28 rounded-full" />
      </div>
      <div className="flex flex-col min-w-0 items-end divide-y divide-dashed divide-muted-foreground/30">
        <div className="flex flex-col items-end gap-1 pb-2 w-full">
          {label
            ? <p className="text-xs text-muted-foreground">{label}</p>
            : <Skeleton className="h-4 w-24 rounded-full" />}
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="pt-2 w-full flex justify-end">
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
