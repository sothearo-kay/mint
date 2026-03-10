"use client";

import type { ChartConfig } from "@mint/ui/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@mint/ui/components/ui/chart";
import { cn } from "@mint/ui/lib/utils";
import { LabelList, Pie, PieChart } from "recharts";

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type PieSlice = {
  id: string;
  name: string;
  value: number;
};

type MintPieChartProps = {
  data: PieSlice[];
  className?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  hideTooltip?: boolean;
  colors?: string[];
  tooltipContent?: React.ReactElement;
  currency?: "USD" | "KHR";
};

function MintPieChart({
  data,
  className,
  showLegend = true,
  showLabels = true,
  hideTooltip = false,
  colors,
  tooltipContent,
  currency = "USD",
}: MintPieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const resolvedColors = colors ?? CHART_COLORS;
  const chartData = data.map((d, i) => ({
    ...d,
    fill: resolvedColors[i % resolvedColors.length],
  }));

  const chartConfig = {
    value: { label: "Amount" },
    ...Object.fromEntries(
      data.map((d, i) => [d.id, { label: d.name, color: resolvedColors[i % resolvedColors.length] }]),
    ),
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={chartConfig} className={cn("aspect-auto [&_.recharts-text]:fill-background", className)}>
        <PieChart>
          {!hideTooltip && <ChartTooltip content={tooltipContent ?? <ChartTooltipContent nameKey="name" hideLabel />} />}
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={30}
            cornerRadius={8}
            paddingAngle={4}
          >
            {showLabels && (
              <LabelList
                dataKey="value"
                stroke="none"
                fontSize={12}
                fontWeight={500}
                formatter={(value: number) => {
                  if (!(total > 0 && (value / total) >= 0.08))
                    return "";
                  const formatted = currency === "KHR"
                    ? (value >= 1000 ? `${Math.round(value / 1000)}k` : `${Math.round(value)}`)
                    : (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`);
                  return currency === "KHR" ? `៛${formatted}` : `$${formatted}`;
                }}
              />
            )}
          </Pie>
        </PieChart>
      </ChartContainer>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {data.map((d, i) => (
            <div key={d.id} className="flex items-center gap-1.5">
              <div
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MintPieChart };
export type { MintPieChartProps, PieSlice };
