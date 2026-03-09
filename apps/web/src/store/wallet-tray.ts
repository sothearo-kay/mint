import type { Wallet } from "@/features/wallets/api/get-wallets";
import { create } from "zustand";

type WalletTrayMode = "create" | "edit" | "delete";

type WalletTrayStore = {
  mode: WalletTrayMode | null;
  wallet: Wallet | null;
  openCreate: () => void;
  openEdit: (wallet: Wallet) => void;
  openDelete: (wallet: Wallet) => void;
  close: () => void;
};

export const useWalletTray = create<WalletTrayStore>(set => ({
  mode: null,
  wallet: null,
  openCreate: () => set({ mode: "create", wallet: null }),
  openEdit: wallet => set({ mode: "edit", wallet }),
  openDelete: wallet => set({ mode: "delete", wallet }),
  close: () => set({ mode: null }),
}));
