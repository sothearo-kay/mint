"use client";

import type { Transaction } from "../api/get-transactions";
import type { CurrencyBalance } from "./transaction-balance";
import type { FilterValue } from "./transaction-filters";
import { useState } from "react";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { useRecurring } from "@/features/recurring/api/get-recurring";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useFilteredGuestTransactions } from "@/store/guest-transactions";
import { useTransactionTray } from "@/store/transaction-tray";
import { sumByCurrency } from "@/utils/transactions";
import { useInfiniteTransactions } from "../api/get-transactions";
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

  useRecurring({ queryConfig: { enabled: !!session } }); // triggers processOverdue as side effect

  const {
    data: pages,
    isPending: isPendingApi,
    isPlaceholderData,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTransactions({
    params: { from: filters.from, to: filters.to, walletId: filters.walletId },
    enabled: !!session,
  });

  const apiTransactions = pages?.pages.flatMap(p => p.data) ?? [];
  const transactions = session ? apiTransactions : guestTransactions;
  const isPending = isSessionPending || (session ? isPendingApi : !hasHydrated);

  const totals = pages?.pages[0]?.totals;
  const currencies: CurrencyBalance[] = session && totals
    ? (["USD", "KHR"] as const).map(currency => ({
        currency,
        income: Number.parseFloat(totals.income[currency]),
        expense: Number.parseFloat(totals.expense[currency]),
        balance: Number.parseFloat(totals.income[currency]) - Number.parseFloat(totals.expense[currency]),
      }))
    : sumByCurrency(guestTransactions);

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
          hasNextPage={!!session && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMoreAction={fetchNextPage}
          onEditAction={openEdit}
          onDeleteAction={openDelete}
        />
      </div>
    </div>
  );
}
