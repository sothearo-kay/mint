import type { Transaction } from "@/features/transactions/api/get-transactions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestTransactionsState = {
  transactions: Transaction[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  add: (tx: Transaction) => void;
  update: (id: string, data: Partial<Transaction>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useGuestTransactions = create<GuestTransactionsState>()(
  persist(
    set => ({
      transactions: [],
      _hasHydrated: false,
      setHasHydrated: value => set({ _hasHydrated: value }),
      add: tx => set(s => ({ transactions: [tx, ...s.transactions] })),
      update: (id, data) =>
        set(s => ({
          transactions: s.transactions.map(tx =>
            tx.id === id ? { ...tx, ...data } : tx,
          ),
        })),
      remove: id =>
        set(s => ({
          transactions: s.transactions.filter(tx => tx.id !== id),
        })),
      clear: () => set({ transactions: [] }),
    }),
    {
      name: "mint-guest-transactions",
      onRehydrateStorage: () => state => state?.setHasHydrated(true),
    },
  ),
);

export function useFilteredGuestTransactions(from: string, to: string, currency?: string) {
  const { transactions, _hasHydrated } = useGuestTransactions();
  const filtered = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= new Date(from) && date <= new Date(to) && (!currency || tx.currency === currency);
  });
  return { transactions: filtered, hasHydrated: _hasHydrated };
}
