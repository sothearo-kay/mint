"use client";

import type { Currency } from "@/utils/constants";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const CURRENCIES: Currency[] = ["USD", "KHR"];

const spring = {
  type: "spring" as const,
  bounce: 0.2,
  duration: 0.35,
};

const ITEM_H = 32;
const ITEM_GAP = 2;

export function CurrencyPickerInline({
  value,
  onChangeAction,
}: {
  value: Currency;
  onChangeAction: (c: Currency) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<Currency | null>(null);

  // Selected currency always first
  const orderedCurrencies = [value, ...CURRENCIES.filter(c => c !== value)];
  const active = tempValue ?? value;
  const activeIdx = orderedCurrencies.indexOf(active);

  function handleSelect(c: Currency) {
    if (c === active) {
      setOpen(false);
      return;
    }
    setTempValue(c);
  }

  return (
    <div className="relative inline-block">
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="invisible flex items-center gap-1 px-2 h-6 text-xs font-bold">
        {value}
        <Icon icon={ArrowDown01Icon} className="size-3" />
      </div>

      <AnimatePresence mode="sync">
        {!open && (
          <motion.div
            key="trigger"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={spring}
            role="button"
            onClick={() => setOpen(true)}
            style={{ transformOrigin: "center" }}
            className="absolute inset-0 flex items-center gap-1 rounded-full bg-foreground px-2 h-6 text-xs font-medium text-background"
          >
            {value}
            <Icon icon={ArrowDown01Icon} className="size-3" />
          </motion.div>
        )}

        {open && (
          <motion.div
            key="menu"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={spring}
            style={{ transformOrigin: "center", x: "-40%", y: "-50%" }}
            className="absolute left-1/2 top-1/2 z-50 overflow-hidden min-w-18 rounded-xl bg-muted p-1.5"
          >
            <div className="relative flex flex-col gap-0.5">
              <motion.div
                className="absolute inset-x-0 h-8 rounded-md bg-foreground pointer-events-none"
                initial={{ y: 0 }}
                animate={{ y: activeIdx * (ITEM_H + ITEM_GAP) }}
                transition={spring}
                onAnimationComplete={() => {
                  if (tempValue !== null) {
                    onChangeAction(tempValue);
                    setTempValue(null);
                    setOpen(false);
                  }
                }}
              />
              {orderedCurrencies.map(c => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "relative z-10 w-full px-4 h-8 text-sm font-medium",
                    active === c ? "text-background" : "text-muted-foreground",
                  )}
                  onClick={() => handleSelect(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
