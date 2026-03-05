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
