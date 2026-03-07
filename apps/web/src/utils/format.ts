import type { Currency } from "@/utils/constants";

export function formatCurrency(amount: number): string {
  return formatNumber(Math.abs(amount), { style: "currency", currency: "USD" });
}

// Large balance display — symbol prefix: $0.00 / ៛400,000
export function formatBalanceAmount(amount: number, currency: Currency): string {
  const abs = Math.abs(amount);
  if (currency === "KHR") {
    return `៛${abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return formatNumber(abs, { style: "currency", currency: "USD" });
}

// Inline amounts (rows, lists) — symbol after: 400,000.00$ / 400,000៛
export function formatAmountByCurrency(amount: number, currency: Currency): string {
  const abs = Math.abs(amount);
  if (currency === "KHR") {
    return `${abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}៛`;
  }
  return `${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export type FormatNumberOptions = {
  style?: "decimal" | "currency" | "percent";
  currency?: string;
  notation?: "standard" | "compact" | "scientific" | "engineering";
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  const {
    style = "decimal",
    currency = "USD",
    notation = "standard",
    locale = "en-US",
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    style,
    notation,
  };

  if (style === "currency") {
    formatOptions.currency = currency;

    if (notation === "compact") {
      formatOptions.maximumFractionDigits = maximumFractionDigits ?? 0;
    }
  }

  if (minimumFractionDigits !== undefined) {
    formatOptions.minimumFractionDigits = minimumFractionDigits;
  }

  if (maximumFractionDigits !== undefined) {
    formatOptions.maximumFractionDigits = maximumFractionDigits;
  }

  return new Intl.NumberFormat(locale, formatOptions).format(value);
}
