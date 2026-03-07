"use client";

import type { TransactionType } from "../api/get-transactions";
import type { Wallet } from "@/features/wallets/api/get-wallets";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mint/ui/components/select";
import { Shimmer } from "@mint/ui/components/ui/shimmer";
import { cn } from "@mint/ui/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { MONTHS, YEARS } from "@/utils/constants";

export type FilterValue = {
  type?: TransactionType;
  from: string;
  to: string;
  walletId?: string;
};

const now = new Date();

export const DEFAULT_FILTERS: FilterValue = {
  from: startOfMonth(now).toISOString(),
  to: endOfMonth(now).toISOString(),
};

type TransactionFiltersProps = {
  showType?: boolean;
  wallets?: Wallet[];
  isFetching?: boolean;
  onChangeAction: (value: FilterValue) => void;
};

export function TransactionFilters({ showType = true, wallets, isFetching, onChangeAction }: TransactionFiltersProps) {
  const [activeType, setTransactionType] = useState<TransactionType>("expense");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [changingKey, setChangingKey] = useState<"type" | "month" | "year" | "wallet" | null>(null);

  useEffect(() => {
    if (!isFetching)
      setChangingKey(null);
  }, [isFetching]);

  function notify(type: TransactionType, month: number, year: number, walletId: string) {
    onChangeAction({
      ...(showType && { type }),
      from: startOfMonth(new Date(year, month)).toISOString(),
      to: endOfMonth(new Date(year, month)).toISOString(),
      walletId: walletId || undefined,
    });
  }

  function handleTypeChange(type: TransactionType) {
    setTransactionType(type);
    setChangingKey("type");
    notify(type, selectedMonth, selectedYear, selectedWalletId);
  }

  function handleMonthChange(month: number) {
    setSelectedMonth(month);
    setChangingKey("month");
    notify(activeType, month, selectedYear, selectedWalletId);
  }

  function handleYearChange(year: number) {
    setSelectedYear(year);
    setChangingKey("year");
    notify(activeType, selectedMonth, year, selectedWalletId);
  }

  function handleWalletChange(walletId: string | null) {
    const id = walletId ?? "";
    setSelectedWalletId(id);
    setChangingKey("wallet");
    notify(activeType, selectedMonth, selectedYear, id);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showType && (
        <div className="flex items-center bg-muted rounded-full p-0.5">
          {(["expense", "income"] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className="relative px-3.5 h-7 rounded-full text-xs font-medium"
            >
              {activeType === type && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className={cn(
                "relative transition-colors duration-150",
                activeType === type ? "text-background" : "text-muted-foreground",
              )}
              >
                {type === "expense" ? "Expenses" : "Income"}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        {wallets && wallets.length > 0 && (
          <Select
            value={selectedWalletId}
            onValueChange={handleWalletChange}
            items={[
              { value: "none", label: "No account" },
              ...wallets.map(w => ({ value: w.id, label: w.name })),
            ]}
          >
            <SelectTrigger className="relative h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
              <Shimmer isPending={isFetching && changingKey === "wallet"} />
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value="">All accounts</SelectItem>
                <SelectItem value="none">No account</SelectItem>
                {wallets.map(w => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Select
          value={selectedMonth.toString()}
          onValueChange={v => handleMonthChange(Number(v))}
          items={MONTHS.map((label, i) => ({ value: i.toString(), label }))}
        >
          <SelectTrigger className="relative h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
            <Shimmer isPending={isFetching && changingKey === "month"} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {MONTHS.map((name, i) => (
                <SelectItem key={name} value={i.toString()}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedYear.toString()}
          onValueChange={v => handleYearChange(Number(v))}
          items={YEARS.map(y => ({ value: y.toString(), label: y.toString() }))}
        >
          <SelectTrigger className="relative h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
            <Shimmer isPending={isFetching && changingKey === "year"} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {YEARS.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
