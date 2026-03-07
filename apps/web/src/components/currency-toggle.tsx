"use client";

import type { Currency } from "@/utils/constants";
import { cn } from "@mint/ui/lib/utils";
import { motion } from "motion/react";
import { useId } from "react";
import { CURRENCIES } from "@/utils/constants";

type CurrencyToggleProps = {
  value: Currency;
  onChangeAction: (currency: Currency) => void;
};

export function CurrencyToggle({ value, onChangeAction }: CurrencyToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center bg-muted rounded-full p-0.5">
      {CURRENCIES.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChangeAction(c)}
          className="relative px-3.5 h-7 rounded-full text-xs font-medium"
        >
          {value === c && (
            <motion.span
              layoutId={id}
              className="absolute inset-0 rounded-full bg-foreground shadow-sm"
              transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
            />
          )}
          <span className={cn(
            "relative transition-colors duration-150",
            value === c ? "text-background" : "text-muted-foreground",
          )}
          >
            {c}
          </span>
        </button>
      ))}
    </div>
  );
}
