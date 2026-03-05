"use client";

import type { Transaction } from "../api/get-transactions";
import type { FilterValue } from "./transaction-filters";
import { ArrowRight01Icon, MoneyNotFoundIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { Separator } from "@mint/ui/components/ui/separator";
import { cn } from "@mint/ui/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { useSession } from "@/features/auth/api";
import { useGuestTransactions } from "@/store/guest-transactions";
import { formatNumber } from "@/utils/format";
import { useTransactions } from "../api/get-transactions";
import { TransactionActionTray } from "./transaction-action-tray";
import { DEFAULT_FILTERS, TransactionFilters } from "./transaction-filters";
import { TransactionRow } from "./transaction-row";

function groupByDate(transactions: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const d = new Date(tx.date);
    const key = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "MMMM d, yyyy");
    if (!map.has(key))
      map.set(key, []);
    map.get(key)!.push(tx);
  }
  return [...map.entries()];
}

export function TransactionList() {
  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [actionMode, setActionMode] = useState<"edit" | "delete" | null>(null);

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

  const { data: session } = useSession();
  const guestStore = useGuestTransactions();

  const { data: apiTransactions = [], isPending: isPendingApi } = useTransactions({
    params: { from: filters.from, to: filters.to },
    queryConfig: { enabled: !!session },
  });

  const guestTransactions = guestStore.transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= new Date(filters.from) && date <= new Date(filters.to);
  });

  const transactions = session ? apiTransactions : guestTransactions;
  const isPending = !!session && isPendingApi;

  const totalIncome = transactions.filter(tx => tx.type === "income").reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);
  const totalExpense = transactions.filter(tx => tx.type === "expense").reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);
  const balance = totalIncome - totalExpense;
  const groups = groupByDate(transactions);

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <TransactionActionTray transaction={selectedTx} mode={actionMode} onCloseAction={closeAction} />
      <TransactionFilters showType={false} onChangeAction={setFilters} />

      <div className="pb-5 border-b-2 border-dashed border-border/60">
        <p className="text-xs text-muted-foreground mb-1">
          Balance
          <span className="inline-block mx-2">{" · "}</span>
          {format(new Date(filters.from), "MMMM yyyy")}
        </p>
        {isPending
          ? (
              <div className="space-y-3">
                <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <div className="h-3 w-10 bg-muted rounded-full animate-pulse" />
                    <div className="h-4.5 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="w-px h-6 bg-muted" />
                  <div className="space-y-1">
                    <div className="h-3 w-12 bg-muted rounded-full animate-pulse" />
                    <div className="h-4.5 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )
          : (
              <>
                <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                  {formatNumber(balance, { style: "currency", currency: "USD" })}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Income</p>
                    <p className="text-sm font-semibold tabular-nums text-primary">
                      {totalIncome > 0 ? "+" : ""}
                      {formatNumber(totalIncome, { style: "currency", currency: "USD" })}
                    </p>
                  </div>

                  <Separator orientation="vertical" className="data-vertical:h-6 data-vertical:self-center" />

                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Expenses</p>
                    <p className="text-sm font-semibold tabular-nums text-destructive">
                      {totalExpense > 0 ? "-" : ""}
                      {formatNumber(totalExpense, { style: "currency", currency: "USD" })}
                    </p>
                  </div>
                </div>
              </>
            )}
      </div>

      {isPending
        ? <ListSkeleton />
        : !transactions.length
            ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="size-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
                    <Icon icon={MoneyNotFoundIcon} className="size-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No transactions</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nothing recorded for
                    {" "}
                    {format(new Date(filters.from), "MMMM yyyy")}
                    .
                  </p>
                </div>
              )
            : (
                <div className="flex flex-col gap-5">
                  {groups.map(([label, txs]) => {
                    const isCollapsed = collapsed.has(label);
                    return (
                      <div key={label}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(label)}
                          className="flex items-center gap-1.5 mb-3 w-full group/header"
                        >
                          <Icon
                            icon={ArrowRight01Icon}
                            className={cn(
                              "size-3 text-muted-foreground transition-transform duration-300",
                              !isCollapsed && "rotate-90",
                            )}
                          />
                          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                        </button>
                        <div
                          className={cn(
                            "grid transition-[grid-template-rows] duration-300",
                            isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-3.5">
                              {txs.map(tx => (
                                <TransactionRow
                                  key={tx.id}
                                  tx={tx}
                                  onEditAction={() => openEdit(tx)}
                                  onDeleteAction={() => openDelete(tx)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[1, 2].map(g => (
        <div key={g} className="space-y-3">
          <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
          <div className="space-y-3.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 bg-muted rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="h-3.5 w-14 bg-muted rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
