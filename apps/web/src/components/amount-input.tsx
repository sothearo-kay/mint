"use client";

import type { Currency } from "@/utils/constants";
import { cn } from "@mint/ui/lib/utils";
import { CurrencyPickerInline } from "./currency-picker-inline";

function formatAmountDisplay(raw: string, currency: Currency): string {
  if (!raw)
    return "";
  const [intPart, decPart] = raw.split(".");
  const formattedInt = Number.parseInt(intPart || "0", 10).toLocaleString();
  if (currency === "KHR")
    return formattedInt;
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

type AmountInputProps = {
  value: string;
  onChangeAction: (v: string) => void;
  type?: "income" | "expense";
  currency: Currency;
  onCurrencyChangeAction?: (c: Currency) => void;
  isBalanceExceeded?: boolean;
  autoFocus?: boolean;
};

export function AmountInput({
  value,
  onChangeAction,
  type = "expense",
  currency,
  onCurrencyChangeAction,
  isBalanceExceeded = false,
  autoFocus,
}: AmountInputProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <input
        type="text"
        inputMode={currency === "KHR" ? "numeric" : "decimal"}
        value={formatAmountDisplay(value, currency)}
        onChange={e => onChangeAction(e.target.value.replace(currency === "KHR" ? /\D/g : /[^0-9.]/g, ""))}
        placeholder="0"
        autoFocus={autoFocus}
        className={cn(
          "bg-transparent outline-none text-5xl font-semibold text-center placeholder:text-muted-foreground/20 field-sizing-content min-w-0",
          isBalanceExceeded
            ? "text-destructive caret-destructive"
            : type === "income"
              ? "caret-primary"
              : "caret-destructive",
          onCurrencyChangeAction ? "ml-14" : "ml-10",
        )}
      />
      {onCurrencyChangeAction
        ? (
            <CurrencyPickerInline value={currency} onChangeAction={onCurrencyChangeAction} />
          )
        : (
            <div className="flex items-center px-2 h-6 rounded-full bg-foreground text-background text-xs font-medium select-none">
              {currency}
            </div>
          )}
    </div>
  );
}
