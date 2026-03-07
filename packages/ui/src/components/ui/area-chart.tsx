"use client";

import type { ChartConfig } from "@mint/ui/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@mint/ui/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type AreaChartSeries = {
  key: string;
  label: string;
  color: string;
};

type MintAreaChartProps = {
  data: Record<string, string | number>[];
  series: AreaChartSeries[];
  xAxisKey?: string;
  className?: string;
};

function MintAreaChart({ data, series, xAxisKey = "month", className }: MintAreaChartProps) {
  const chartConfig = Object.fromEntries(
    series.map(s => [s.key, { label: s.label, color: s.color }]),
  ) satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          {series.map(s => (
            <linearGradient key={s.key} id={`gradient-area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${s.key})`} stopOpacity={0.5} />
              <stop offset="95%" stopColor={`var(--color-${s.key})`} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        {series.map(s => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="monotone"
            fill={`url(#gradient-area-${s.key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${s.key})`}
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

export { MintAreaChart };
export type { AreaChartSeries, MintAreaChartProps };
