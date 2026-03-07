"use client";

import { cn } from "@mint/ui/lib/utils";
import { motion } from "motion/react";
import { useId } from "react";

type SegmentItem<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  items: SegmentItem<T>[];
  value: T | undefined;
  onChangeAction: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  items,
  value,
  onChangeAction,
  className,
}: SegmentedControlProps<T>) {
  const id = useId();

  return (
    <div className={cn("relative flex rounded-xl bg-muted p-1", className)}>
      {items.map(item => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChangeAction(item.value)}
          className="relative z-10 flex-1 rounded-lg py-1.5 text-sm font-medium"
        >
          {value === item.value && (
            <motion.span
              layoutId={id}
              className="absolute inset-0 rounded-lg bg-background shadow-sm"
              transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
            />
          )}
          <span className={cn(
            "relative transition-colors",
            value === item.value ? "text-foreground" : "text-muted-foreground",
          )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
