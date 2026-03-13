"use client";

import type { Transaction } from "@/features/transactions/api/get-transactions";
import type { WalletTransfer } from "@/features/wallets/api/get-wallet-transfers";
import {
  ArrowDownLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Delete01Icon,
  MoneyNotFoundIcon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { buttonVariants } from "@mint/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mint/ui/components/dropdown-menu";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { formatAmountByCurrency } from "@/utils/format";

type ActivityItem
  = | { kind: "transaction"; data: Transaction; date: Date }
    | { kind: "transfer"; data: WalletTransfer; date: Date };

function groupByDate(items: ActivityItem[]): [string, ActivityItem[]][] {
  const map = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const key = isToday(item.date)
      ? "Today"
      : isYesterday(item.date)
        ? "Yesterday"
        : format(item.date, "MMMM d, yyyy");
    if (!map.has(key))
      map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()];
}

type WalletActivityListProps = {
  walletId: string;
  transactions: Transaction[];
  transfers: WalletTransfer[];
  isPending: boolean;
  isError: boolean;
  from: string;
  onEditAction: (tx: Transaction) => void;
  onDeleteAction: (tx: Transaction) => void;
};

export function WalletActivityList({
  walletId,
  transactions,
  transfers,
  isPending,
  isError,
  from,
  onEditAction,
  onDeleteAction,
}: WalletActivityListProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (isPending)
    return <ActivitySkeleton />;
  if (isError)
    return <EmptyState icon={MoneyNotFoundIcon} title="Something went wrong" description="Could not load activity." />;

  const items: ActivityItem[] = [
    ...transactions.map(t => ({ kind: "transaction" as const, data: t, date: new Date(t.date) })),
    ...transfers.map(t => ({ kind: "transfer" as const, data: t, date: new Date(t.date) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MoneyNotFoundIcon}
        title="No activity"
        description={`Nothing recorded for ${format(new Date(from), "MMMM yyyy")}.`}
      />
    );
  }

  const groups = groupByDate(items);

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      {groups.map(([label, groupItems]) => {
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
            <div className={cn(
              "grid transition-[grid-template-rows] duration-300",
              isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
            )}
            >
              <div className="overflow-hidden">
                <div className="*:last:mb-1">
                  {groupItems.map(item =>
                    item.kind === "transaction"
                      ? (
                          <TransactionActivityRow
                            key={item.data.id}
                            tx={item.data}
                            onEditAction={() => onEditAction(item.data)}
                            onDeleteAction={() => onDeleteAction(item.data)}
                          />
                        )
                      : (
                          <TransferActivityRow
                            key={item.data.id}
                            transfer={item.data}
                            walletId={walletId}
                          />
                        ),
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TransactionActivityRow({
  tx,
  onEditAction,
  onDeleteAction,
}: {
  tx: Transaction;
  onEditAction?: () => void;
  onDeleteAction?: () => void;
}) {
  const hasRecurring = !!tx.recurring;

  return (
    <div className="group flex items-center gap-3 pb-3.5">
      <div className="relative size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
        <DynamicIcon name={tx.category.icon} className="size-5 text-muted-foreground" />
        {!hasRecurring && (
          <span className={cn(
            "absolute bottom-0 -right-1 flex size-3.5 items-center justify-center rounded-full ring-1 ring-border",
            tx.type === "income" ? "bg-income" : "bg-expense",
          )}
          >
            <Icon
              icon={tx.type === "income" ? ArrowDownLeft01Icon : ArrowUpRight01Icon}
              strokeWidth={2.5}
              className="size-3 text-white"
            />
          </span>
        )}
      </div>

      <div className="ml-1 flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-snug">
          {hasRecurring ? tx.recurring!.name : tx.category.name}
        </p>
        {tx.note && <p className="text-xs text-muted-foreground truncate mt-0.5">{tx.note}</p>}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-0 overflow-hidden group-hover:w-7 has-data-popup-open:w-7 [@media(hover:none)]:w-7 transition-all duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), "shrink-0")}>
              <Icon icon={MoreHorizontalIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditAction}>
                <Icon icon={PencilEdit02Icon} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDeleteAction}>
                <Icon icon={Delete01Icon} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className={cn(
          "text-sm font-medium tabular-nums",
          tx.type === "income" ? "text-primary" : "text-destructive",
        )}
        >
          {tx.type === "income" ? "+" : "-"}
          {formatAmountByCurrency(Number.parseFloat(tx.amount), tx.currency)}
        </span>
      </div>
    </div>
  );
}

function TransferActivityRow({
  transfer,
  walletId,
}: {
  transfer: WalletTransfer;
  walletId: string;
}) {
  const isOutgoing = transfer.fromWalletId === walletId;
  const otherWallet = isOutgoing ? transfer.toWallet : transfer.fromWallet;
  const amount = isOutgoing ? transfer.fromAmount : transfer.toAmount;
  const currency = isOutgoing ? transfer.fromWallet.currency : transfer.toWallet.currency;

  return (
    <div className="flex items-center gap-3 pb-3.5">
      <div className="relative size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
        <Icon
          icon={isOutgoing ? MoneySendCircleIcon : MoneyReceiveCircleIcon}
          className="size-5 text-muted-foreground"
        />
      </div>

      <div className="ml-1 flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-snug">
          {otherWallet.name}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {transfer.note || (isOutgoing ? "Transfer out" : "Transfer in")}
        </p>
      </div>

      <span className={cn(
        "text-sm font-medium tabular-nums shrink-0",
        isOutgoing ? "text-destructive" : "text-primary",
      )}
      >
        {isOutgoing ? "-" : "+"}
        {formatAmountByCurrency(Number.parseFloat(amount), currency)}
      </span>
    </div>
  );
}

function ActivitySkeleton() {
  const rows = [
    { nameW: "w-24", hasNote: false, amountW: "w-16" },
    { nameW: "w-32", hasNote: true, amountW: "w-12" },
    { nameW: "w-20", hasNote: false, amountW: "w-14" },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {[1, 2].map(g => (
        <div key={g}>
          <Skeleton className="h-4 w-14 rounded-full mb-3" />
          <div className="*:last:mb-1">
            {rows.map((row, i) => (
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
