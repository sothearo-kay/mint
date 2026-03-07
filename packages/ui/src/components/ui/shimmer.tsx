import { cn } from "@mint/ui/lib/utils";

interface ShimmerProps {
  isPending?: boolean;
  long?: boolean;
  className?: string;
}

export function Shimmer({ isPending, long, className }: ShimmerProps) {
  if (!isPending) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 bg-linear-to-r from-transparent via-foreground/10 to-transparent",
          long ? "animate-shimmer-long" : "animate-shimmer",
        )}
      />
    </span>
  );
}
