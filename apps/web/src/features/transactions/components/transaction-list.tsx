"use client";

import type { Transaction } from "../api/get-transactions";
import type { FilterValue } from "./transaction-filters";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { useFilteredGuestTransactions } from "@/store/guest-transactions";
import { sumByType } from "@/utils/transactions";
import { useTransactions } from "../api/get-transactions";
import { Balance } from "./balance-section";
import { TransactionActionTray } from "./transaction-action-tray";
import { DEFAULT_FILTERS, TransactionFilters } from "./transaction-filters";
import { TransactionList } from "./transaction-list-view";

export function Transactions() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [actionMode, setActionMode] = useState<"edit" | "delete" | null>(null);

  const { data: session } = useSession();
  const guestTransactions = useFilteredGuestTransactions(filters.from, filters.to);

  const { data: apiTransactions = [], isPending: isPendingApi, isPlaceholderData, isError } = useTransactions({
    params: { from: filters.from, to: filters.to },
    queryConfig: { enabled: !!session },
  });

  const transactions = session ? apiTransactions : guestTransactions;
  const isPending = !!session && isPendingApi;

  const { income: totalIncome, expense: totalExpense } = sumByType(transactions);
  const balance = totalIncome - totalExpense;

  function openEdit(tx: Transaction) {
    setSelectedTx(tx);
    setActionMode("edit");
  }

  function openDelete(tx: Transaction) {
    setSelectedTx(tx);
    setActionMode("delete");
  }

  function closeAction() {
    setActionMode(null);
    setTimeout(() => setSelectedTx(null), 300);
  }

  return (
    <div className="flex flex-col gap-4 mb-14">
      <Fab onClickAction={() => router.push("?new=true")} />
      <TransactionActionTray transaction={selectedTx} mode={actionMode} onCloseAction={closeAction} />
      <TransactionFilters showType={false} isFetching={!!session && isPlaceholderData} onChangeAction={setFilters} />

      <div className="flex flex-col gap-6">
        <Balance
          isPending={isPending}
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          from={filters.from}
        />
        <TransactionList
          isError={isError}
          isPending={isPending}
          transactions={transactions}
          from={filters.from}
          onEditAction={openEdit}
          onDeleteAction={openDelete}
        />
      </div>
    </div>
  );
}
