"use client";

import type { RecurringTransaction } from "../api/get-recurring";
import { Delete01Icon, MoreHorizontalIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
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
import Image from "next/image";
import { formatAmountByCurrency } from "@/utils/format";

const FREQUENCY_LABEL: Record<RecurringTransaction["frequency"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

function formatNextDue(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs < 0)
    return "Overdue";
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0)
    return "Today";
  if (diffDays === 1)
    return "Tomorrow";
  if (diffDays < 7)
    return `In ${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type RecurringRowProps = {
  recurring: RecurringTransaction;
  onEditAction: () => void;
  onDeleteAction: () => void;
};

export function RecurringRow({ recurring, onEditAction, onDeleteAction }: RecurringRowProps) {
  const isExpense = recurring.type === "expense";
  const nextDue = formatNextDue(recurring.nextScheduledDate);
  const isOverdue = nextDue === "Overdue";

  return (
    <div className="group flex items-center gap-3 pb-3.5">
      <div className="size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {recurring.logo
          ? (
              <Image
                src={recurring.logo}
                alt={recurring.name}
                width={20}
                height={20}
                className="size-5 object-contain"
              />
            )
          : <DynamicIcon name={recurring.category.icon} className="size-5 text-muted-foreground" />}
      </div>

      <div className="ml-1 flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate leading-snug">{recurring.name}</span>
          {!recurring.isActive && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
              Paused
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {FREQUENCY_LABEL[recurring.frequency]}
          {" "}
          <span className="inline-block mx-0.5">{" · "}</span>
          {" "}
          <span className={cn(isOverdue ? "text-destructive font-medium" : "")}>{nextDue}</span>
        </p>
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
        <span className={cn("text-sm font-medium tabular-nums", isExpense ? "text-destructive" : "text-primary")}>
          {Number.parseFloat(recurring.amount) !== 0 ? (recurring.type === "income" ? "+" : "-") : ""}
          {formatAmountByCurrency(Number.parseFloat(recurring.amount), recurring.currency)}
        </span>
      </div>
    </div>
  );
}
