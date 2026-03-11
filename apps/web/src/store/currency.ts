import type { Currency } from "@/utils/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    set => ({
      currency: "USD",
      setCurrency: currency => set({ currency }),
    }),
    { name: "mint-currency" },
  ),
);
