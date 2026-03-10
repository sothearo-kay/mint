import type { RecurringTransaction } from "@/features/recurring/api/get-recurring";
import { create } from "zustand";

type RecurringTrayMode = "create" | "edit" | "delete";

type RecurringTrayStore = {
  mode: RecurringTrayMode | null;
  recurring: RecurringTransaction | null;
  openCreate: () => void;
  openEdit: (recurring: RecurringTransaction) => void;
  openDelete: (recurring: RecurringTransaction) => void;
  close: () => void;
};

export const useRecurringTray = create<RecurringTrayStore>(set => ({
  mode: null,
  recurring: null,
  openCreate: () => set({ mode: "create", recurring: null }),
  openEdit: recurring => set({ mode: "edit", recurring }),
  openDelete: recurring => set({ mode: "delete", recurring }),
  close: () => set({ mode: null }),
}));
