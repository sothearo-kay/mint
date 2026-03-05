"use client";

import type { TransactionType } from "../api/get-transactions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@mint/ui/components/select";
import { cn } from "@mint/ui/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";
import { motion } from "motion/react";
import { useState } from "react";

export type FilterValue = {
  type?: TransactionType;
  from: string;
  to: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

const now = new Date();

export const DEFAULT_FILTERS: FilterValue = {
  from: startOfMonth(now).toISOString(),
  to: endOfMonth(now).toISOString(),
};

type TransactionFiltersProps = {
  showType?: boolean;
  onChangeAction: (value: FilterValue) => void;
};

export function TransactionFilters({ showType = true, onChangeAction }: TransactionFiltersProps) {
  const [activeType, setTransactionType] = useState<TransactionType>("expense");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  function notify(type: TransactionType, month: number, year: number) {
    onChangeAction({
      ...(showType && { type }),
      from: startOfMonth(new Date(year, month)).toISOString(),
      to: endOfMonth(new Date(year, month)).toISOString(),
    });
  }

  function handleTypeChange(type: TransactionType) {
    setTransactionType(type);
    notify(type, selectedMonth, selectedYear);
  }

  function handleMonthChange(month: number) {
    setSelectedMonth(month);
    notify(activeType, month, selectedYear);
  }

  function handleYearChange(year: number) {
    setSelectedYear(year);
    notify(activeType, selectedMonth, year);
  }

  return (
    <div className="flex items-center gap-2">
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
        <Select
          value={selectedMonth.toString()}
          onValueChange={v => handleMonthChange(Number(v))}
        >
          <SelectTrigger className="h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
            {MONTHS[selectedMonth]}
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
        >
          <SelectTrigger className="h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
            {selectedYear}
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
