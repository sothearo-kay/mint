"use client";

import type { Transaction } from "../api/get-transactions";
import { ArrowRight01Icon, MoneyNotFoundIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
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

type TransactionListProps = {
  isError: boolean;
  isPending: boolean;
  transactions: Transaction[];
  from: string;
  onEditAction: (tx: Transaction) => void;
  onDeleteAction: (tx: Transaction) => void;
};

export function TransactionList({ isError, isPending, transactions, from, onEditAction, onDeleteAction }: TransactionListProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const groups = groupByDate(transactions);

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  if (isError)
    return <ErrorState />;
  if (isPending)
    return <ListSkeleton />;
  if (!transactions.length) {
    return (
      <EmptyState
        icon={MoneyNotFoundIcon}
        title="No transactions"
        description={`Nothing recorded for ${format(new Date(from), "MMMM yyyy")}.`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([label, txs]) => {
        const isCollapsed = collapsed.has(label);
        return (
          <div key={label} className="*:last:mb-2">
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
                      onEditAction={() => onEditAction(tx)}
                      onDeleteAction={() => onDeleteAction(tx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map(g => (
        <div key={g} className="space-y-3 *:last:mb-2">
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
