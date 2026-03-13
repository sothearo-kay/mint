"use client";

import type { Transaction } from "../api/get-transactions";
import { ArrowRight01Icon, MoneyNotFoundIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { groupByDate } from "@/utils/group-by-date";
import { TransactionRow } from "./transaction-row";

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
  const groups = groupByDate(transactions, tx => new Date(tx.date));

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
    <div className="flex flex-col gap-2.5">
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
                <div className="*:last:mb-1">
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

const SKELETON_ROWS = [
  { nameW: "w-24", hasNote: false, amountW: "w-16" },
  { nameW: "w-32", hasNote: true, amountW: "w-12" },
  { nameW: "w-20", hasNote: false, amountW: "w-14" },
];

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[1, 2].map(g => (
        <div key={g}>
          <Skeleton className="h-4 w-14 rounded-full mb-3" />
          <div className="*:last:mb-1">
            {SKELETON_ROWS.map((row, i) => (
              <div key={i} className="flex items-center gap-3 pb-3.5">
                <div className="relative size-10 shrink-0">
                  <Skeleton className="size-10 rounded-2xl" />
                  <Skeleton className="absolute bottom-0 -right-1 size-3.5 rounded-full" />
                </div>
                <div className="ml-2 flex-1 space-y-1.5">
                  <Skeleton className={cn("h-3.5 rounded-full", row.nameW)} />
                  {row.hasNote && <Skeleton className="h-3 w-20 rounded-full" />}
                </div>
                <Skeleton className={cn("h-3.5 rounded-full", row.amountW)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
