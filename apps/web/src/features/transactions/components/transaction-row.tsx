"use client";

import type { Transaction } from "../api/get-transactions";
import { ArrowDownLeft01Icon, ArrowUpRight01Icon, Delete01Icon, MoreHorizontalIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@mint/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mint/ui/components/dropdown-menu";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { formatAmountByCurrency } from "@/utils/format";

type TransactionRowProps = {
  tx: Transaction;
  onEditAction?: () => void;
  onDeleteAction?: () => void;
};

export function TransactionRow({ tx, onEditAction, onDeleteAction }: TransactionRowProps) {
  return (
    <div className="group flex items-center gap-3 pb-3.5">
      <div className="relative size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
        <DynamicIcon name={tx.category.icon} className="size-5 text-muted-foreground" />
        <span className={cn(
          "absolute -bottom-1 -right-2 flex size-4.5 items-center justify-center rounded-full ring-1 ring-border",
          tx.type === "income" ? "bg-income" : "bg-expense",
        )}
        >
          <Icon
            icon={tx.type === "income" ? ArrowDownLeft01Icon : ArrowUpRight01Icon}
            strokeWidth={2.5}
            className="size-3.5 text-white"
          />
        </span>
      </div>
      <div className="ml-2 flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-snug">
          {tx.category.name}
        </p>
        {tx.note && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{tx.note}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-0 overflow-hidden group-hover:w-7 has-data-popup-open:w-7 transition-all duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), "shrink-0")}
            >
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
          {Number.parseFloat(tx.amount) !== 0 ? (tx.type === "income" ? "+" : "-") : ""}
          {formatAmountByCurrency(Number.parseFloat(tx.amount), tx.currency)}
        </span>
      </div>
    </div>
  );
}
