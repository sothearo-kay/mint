"use client";

import type { Currency } from "@/utils/constants";
import { PieChartIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { MintPieChart } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { MintCard } from "@/components/card";

type TopCategoriesCardProps = {
  categories: { id: string; name: string; icon: string; amount: string }[];
  isPending?: boolean;
  currency?: Currency;
};

export function TopCategoriesCard({ categories, isPending, currency = "USD" }: TopCategoriesCardProps) {
  const top = categories.slice(0, 5);

  const chartData = top.map(cat => ({
    id: cat.id,
    name: cat.name,
    value: Number.parseFloat(cat.amount),
  }));

  return (
    <MintCard title={(
      <>
        <Icon icon={PieChartIcon} className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Top Spending</span>
      </>
    )}
    >
      {isPending
        ? (
            <Skeleton className="h-40 rounded-xl" />
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
                className="h-48 w-full"
                currency={currency}
              />
            )}
    </MintCard>
  );
}
