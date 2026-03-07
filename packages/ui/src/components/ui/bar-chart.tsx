"use client";

import type { ChartConfig } from "@mint/ui/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@mint/ui/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

type MintBarChartProps = {
  data: Record<string, string | number>[];
  dataKey: string;
  color: string;
  label: string;
  xAxisKey?: string;
  className?: string;
};

const CustomHatchedBar = (props: React.SVGProps<SVGRectElement> & { dataKey?: string; fill?: string }) => {
  const { fill, x, y, width, height, dataKey } = props;
  const patternId = `hatched-bar-${dataKey}`;
  return (
    <>
      <defs>
        <pattern id={patternId} x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="10" height="10" opacity={0.5} fill={fill} />
          <rect width="1" height="10" fill={fill} />
        </pattern>
      </defs>
      <rect rx={4} x={x} y={y} width={width} height={height} fill={`url(#${patternId})`} />
    </>
  );
};

const DottedBackground = () => (
  <pattern id="bar-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1" className="fill-muted dark:fill-muted/40" />
  </pattern>
);

function MintBarChart({ data, dataKey, color, label, xAxisKey = "month", className }: MintBarChartProps) {
  const chartConfig = {
    [dataKey]: { label, color },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart accessibilityLayer data={data}>
        <defs>
          <DottedBackground />
        </defs>
        <rect x="0" y="0" width="100%" height="85%" fill="url(#bar-dots)" />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar
          dataKey={dataKey}
          // @ts-expect-error recharts custom shape
          shape={<CustomHatchedBar dataKey={dataKey} />}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}

export { MintBarChart };
export type { MintBarChartProps };
