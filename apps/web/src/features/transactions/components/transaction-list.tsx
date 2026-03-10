"use client";

import type { Transaction } from "../api/get-transactions";
import type { FilterValue } from "./transaction-filters";
import { useState } from "react";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useFilteredGuestTransactions } from "@/store/guest-transactions";
import { useTransactionTray } from "@/store/transaction-tray";
import { sumByCurrency } from "@/utils/transactions";
import { useTransactions } from "../api/get-transactions";
import { TransactionActionTray } from "./transaction-action-tray";
import { TransactionBalance } from "./transaction-balance";
import { DEFAULT_FILTERS, TransactionFilters } from "./transaction-filters";
import { TransactionList } from "./transaction-list-view";

export function Transactions() {
  const { open } = useTransactionTray();
  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [actionMode, setActionMode] = useState<"edit" | "delete" | null>(null);

  const { data: session, isPending: isSessionPending } = useSession();
  const { data: wallets = [] } = useWallets({ queryConfig: { enabled: !!session } });
  const { transactions: guestTransactions, hasHydrated } = useFilteredGuestTransactions(filters.from, filters.to);

  const { data: apiTransactions = [], isPending: isPendingApi, isPlaceholderData, isError } = useTransactions({
    params: { from: filters.from, to: filters.to, walletId: filters.walletId },
    queryConfig: { enabled: !!session },
  });

  const transactions = session ? apiTransactions : guestTransactions;
  const isPending = isSessionPending || (session ? isPendingApi : !hasHydrated);
  const currencies = sumByCurrency(transactions);

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
    <div className="flex flex-col gap-4 mb-10.5">
      <Fab onClickAction={open} />
      <TransactionActionTray transaction={selectedTx} mode={actionMode} onCloseAction={closeAction} />
      <TransactionFilters
        showType={false}
        wallets={session ? wallets : undefined}
        isFetching={!!session && isPlaceholderData}
        onChangeAction={setFilters}
      />

      <div className="flex flex-col gap-6">
        <TransactionBalance
          isPending={isPending}
          currencies={currencies}
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
