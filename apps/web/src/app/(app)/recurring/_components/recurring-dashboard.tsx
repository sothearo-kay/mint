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
import { Fab } from "@/components/fab";
import { ToggleGroup } from "@/components/toggle-group";
import { useSession } from "@/features/auth/api";
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

  const { data: allRecurring = [], isPending: isQueryPending } = useRecurring({
    queryConfig: { enabled: !!session },
  });
  const isPending = isSessionPending || (!!session && isQueryPending);

  const filtered = allRecurring.filter((r) => {
    const currencyMatch = r.currency === currency;
    const frequencyMatch = !frequency || r.frequency === frequency;
    return currencyMatch && frequencyMatch;
  });

  return (
    <>
      <RecurringActionTray />
      <Fab onClickAction={openCreate} />
      <div className="flex flex-col gap-4">
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
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false}>
              <SelectGroup>
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
