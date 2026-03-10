"use client";

import type { RecurringTransaction } from "../api/get-recurring";
import { Delete01Icon, MoreHorizontalIcon, PencilEdit02Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
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
import Image from "next/image";
import { EmptyState } from "@/components/empty-state";
import { useRecurringTray } from "@/store/recurring-tray";

const FREQUENCY_LABEL: Record<RecurringTransaction["frequency"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

function formatNextDue(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return "Overdue";
  if (diffDays === 0)
    return "Today";
  if (diffDays === 1)
    return "Tomorrow";
  if (diffDays < 7)
    return `In ${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type RecurringRowProps = {
  recurring: RecurringTransaction;
  onEditAction: () => void;
  onDeleteAction: () => void;
};

function RecurringRow({ recurring, onEditAction, onDeleteAction }: RecurringRowProps) {
  const isExpense = recurring.type === "expense";
  const symbol = recurring.currency === "KHR" ? "៛" : "$";
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
          {isExpense ? "-" : "+"}
          {symbol}
          {Number.parseFloat(recurring.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const SKELETON_ROWS = [
  { nameW: "w-24", amountW: "w-16" },
  { nameW: "w-32", amountW: "w-12" },
  { nameW: "w-20", amountW: "w-14" },
];

function RecurringListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[1, 2].map(g => (
        <div key={g}>
          <Skeleton className="h-4 w-14 rounded-full mb-3" />
          <div>
            {SKELETON_ROWS.map((row, i) => (
              <div key={i} className="flex items-center gap-3 pb-3.5">
                <Skeleton className="size-10 rounded-2xl shrink-0" />
                <div className="ml-1 flex-1 space-y-1.5">
                  <Skeleton className={cn("h-3.5 rounded-full", row.nameW)} />
                  <Skeleton className="h-3 w-20 rounded-full" />
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

type RecurringListProps = {
  recurring: RecurringTransaction[];
  isPending: boolean;
};

export function RecurringList({ recurring, isPending }: RecurringListProps) {
  const { openEdit, openDelete } = useRecurringTray();

  if (isPending) {
    return <RecurringListSkeleton />;
  }

  if (!recurring.length) {
    return (
      <EmptyState
        icon={Refresh01Icon}
        title="No recurring transactions"
        description="Set up subscriptions, bills, or salary to track automatically"
      />
    );
  }

  const now = new Date();
  const upcoming = recurring
    .filter((r) => {
      const diffDays = Math.ceil((new Date(r.nextScheduledDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .sort((a, b) => new Date(a.nextScheduledDate).getTime() - new Date(b.nextScheduledDate).getTime());

  const income = recurring.filter(r => r.type === "income");
  const expenses = recurring.filter(r => r.type === "expense");

  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">Upcoming</p>
          <div>
            {upcoming.map(r => (
              <RecurringRow
                key={r.id}
                recurring={r}
                onEditAction={() => openEdit(r)}
                onDeleteAction={() => openDelete(r)}
              />
            ))}
          </div>
        </div>
      )}

      {income.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">Income</p>
          <div>
            {income.map(r => (
              <RecurringRow
                key={r.id}
                recurring={r}
                onEditAction={() => openEdit(r)}
                onDeleteAction={() => openDelete(r)}
              />
            ))}
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">Subscriptions & Bills</p>
          <div>
            {expenses.map(r => (
              <RecurringRow
                key={r.id}
                recurring={r}
                onEditAction={() => openEdit(r)}
                onDeleteAction={() => openDelete(r)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
