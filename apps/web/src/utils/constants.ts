export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export const CURRENCIES = ["USD", "KHR"] as const;
export type Currency = typeof CURRENCIES[number];
