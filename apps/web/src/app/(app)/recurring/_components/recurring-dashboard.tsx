"use client";

import type { RecurringTransaction } from "@/features/recurring/api/get-recurring";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mint/ui/components/select";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { Fab } from "@/components/fab";
import { ToggleGroup } from "@/components/toggle-group";
import { useSession } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useRecurring } from "@/features/recurring/api/get-recurring";
import { RecurringActionTray } from "@/features/recurring/components/recurring-action-tray";
import { RecurringList } from "@/features/recurring/components/recurring-list";
import { useCurrencyStore } from "@/store/currency";
import { useRecurringTray } from "@/store/recurring-tray";
import { RecurringSummary } from "./recurring-summary";

type Frequency = RecurringTransaction["frequency"] | "";

const FREQUENCY_OPTIONS: { value: RecurringTransaction["frequency"]; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function RecurringDashboard() {
  const { openCreate } = useRecurringTray();
  const { data: session, isPending: isSessionPending } = useSession();
  const { currency, setCurrency } = useCurrencyStore();
  const [frequency, setFrequency] = useState<Frequency>("");

  const { data: allRecurringRaw = [], isPending: isQueryPending } = useRecurring({
    queryConfig: { enabled: !!session },
  });
  const isPending = isSessionPending || (!!session && isQueryPending);
  const allRecurring = session ? allRecurringRaw : [];

  const filtered = allRecurring.filter((r) => {
    const currencyMatch = r.currency === currency;
    const frequencyMatch = !frequency || r.frequency === frequency;
    return currencyMatch && frequencyMatch;
  });

  return (
    <>
      <RecurringActionTray />
      {session && <Fab onClickAction={openCreate} />}
      <div className="h-full relative flex flex-col gap-4 mb-10.5">
        {!isSessionPending && !session && (
          <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-transparent from-10% via-background/80 via-40% to-background to-60%" />
            <div className="absolute inset-0 mask-[linear-gradient(to_bottom,transparent_10%,black_50%)] backdrop-blur-sm" />
            <div className="absolute left-0 right-0 flex flex-col items-center gap-2 text-center pb-16 max-sm:top-1/3 sm:bottom-1/3">
              <EmptyState
                title="Sign in to view recurring"
                description="Track subscriptions, bills, and salary automatically when signed in."
              >
                <LoginDialog triggerProps={{ size: "sm", className: "rounded-full mt-1" }} />
              </EmptyState>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <ToggleGroup
            items={[
              { value: "USD", label: "USD" },
              { value: "KHR", label: "KHR" },
            ]}
            value={currency}
            onChangeAction={setCurrency}
            variant="pill"
          />
          <Select value={frequency} onValueChange={v => setFrequency(v as Frequency)}>
            <SelectTrigger className="relative h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
              <SelectValue placeholder="All frequency" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value="">All frequency</SelectItem>
                {FREQUENCY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6">
          <RecurringSummary
            recurring={filtered}
            currency={currency}
            frequency={frequency || "all"}
            isPending={isPending}
          />

          <RecurringList
            recurring={filtered}
            isPending={isPending}
          />
        </div>
      </div>
    </>
  );
}
