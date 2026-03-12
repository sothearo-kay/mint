"use client";

import type { RecurringTransaction } from "../api/get-recurring";
import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useRecurringTray } from "@/store/recurring-tray";
import { RecurringRow } from "./recurring-row";

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

  const upcomingIds = new Set(upcoming.map(r => r.id));
  const income = recurring.filter(r => r.type === "income" && !upcomingIds.has(r.id));
  const expenses = recurring.filter(r => r.type === "expense" && !upcomingIds.has(r.id));

  return (
    <div className="flex flex-col gap-2.5">
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
