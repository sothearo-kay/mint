"use client";

import { cn } from "@mint/ui/lib/utils";
import { motion } from "motion/react";
import { useId } from "react";

type ToggleItem<T extends string> = {
  value: T;
  label: string;
};

type ToggleGroupProps<T extends string> = {
  items: readonly ToggleItem<T>[];
  value: T | undefined;
  onChangeAction: (value: T) => void;
  variant?: "soft" | "pill";
  className?: string;
};

export function ToggleGroup<T extends string>({
  items,
  value,
  onChangeAction,
  variant = "soft",
  className,
}: ToggleGroupProps<T>) {
  const id = useId();
  const isPill = variant === "pill";

  return (
    <div className={cn(
      "relative flex bg-muted",
      isPill ? "rounded-full p-0.5" : "rounded-xl p-1",
      className,
    )}
    >
      {items.map(item => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChangeAction(item.value)}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center font-medium transition-colors",
            isPill ? "rounded-full px-3.5 h-7 text-xs" : "rounded-lg h-7 text-sm",
            value === item.value
              ? isPill ? "text-background" : "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {value === item.value && (
            <motion.span
              layoutId={id}
              className={cn(
                "absolute inset-0 shadow-sm",
                isPill ? "rounded-full bg-foreground" : "rounded-lg bg-background",
              )}
              transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
            />
          )}
          <span className="relative">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
