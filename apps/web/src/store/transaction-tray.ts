import { create } from "zustand";

type TransactionTrayStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useTransactionTray = create<TransactionTrayStore>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
