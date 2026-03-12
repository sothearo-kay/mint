type PieTooltipProps = {
  active?: boolean;
  payload?: any[];
  labelMap: Record<string, string[]>;
};

export function PieTooltip({ active, payload, labelMap }: PieTooltipProps) {
  if (!active || !payload?.length)
    return null;

  const name = payload[0]?.name as string;
  const fill = payload[0]?.payload?.fill as string;
  const lines = labelMap[name];

  if (!lines?.length)
    return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
      <div className="flex items-start gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-xs shrink-0" style={{ background: fill }} />
          <span className="text-muted-foreground whitespace-nowrap">{name}</span>
        </div>
        <div className="flex flex-col items-end font-mono font-medium tabular-nums">
          {lines.map((line, i) => <span key={i}>{line}</span>)}
        </div>
      </div>
    </div>
  );
}
