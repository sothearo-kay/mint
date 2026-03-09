"use client";

import { PieChartIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { MintPieChart } from "@mint/ui/components/ui/pie-chart";
import { InsightCard } from "./insight-card";

type TopCategoriesCardProps = {
  categories: { id: string; name: string; icon: string; amount: string }[];
  isPending?: boolean;
};

export function TopCategoriesCard({ categories, isPending }: TopCategoriesCardProps) {
  const top = categories.slice(0, 5);

  const chartData = top.map(cat => ({
    id: cat.id,
    name: cat.name,
    value: Number.parseFloat(cat.amount),
  }));

  return (
    <InsightCard title={(
      <>
        <Icon icon={PieChartIcon} className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Top Spending</span>
      </>
    )}
    >
      {isPending
        ? (
            <div className="h-40 bg-muted rounded-xl animate-pulse" />
          )
        : top.length === 0
          ? (
              <div className="flex-1 flex items-center justify-center py-14">
                <p className="text-sm text-muted-foreground">No spending data</p>
              </div>
            )
          : (
              <MintPieChart
                data={chartData}
                className="h-56 w-full"
              />
            )}
    </InsightCard>
  );
}
