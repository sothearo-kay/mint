"use client";

import type { Currency } from "@/utils/constants";
import { ArrowDownLeft01Icon, ArrowUpRight01Icon, Chart03Icon, Money01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@mint/ui/components/select";
import { MintAreaChart } from "@mint/ui/components/ui/area-chart";
import { Shimmer } from "@mint/ui/components/ui/shimmer";
import { endOfYear, startOfYear } from "date-fns";
import { useState } from "react";
import { CurrencyToggle } from "@/components/currency-toggle";
import { ErrorState } from "@/components/error-state";
import { useSession } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useCategorySummary } from "@/features/categories/api/get-summary";
import { useBreakdown } from "@/features/insights/api/get-breakdown";
import { useInsights } from "@/features/insights/api/get-insights";
import { CURRENT_YEAR, MONTHS, YEARS } from "@/utils/constants";
import { InsightCard } from "./insight-card";
import { SavingsRateCard } from "./savings-rate-card";
import { SummaryCard } from "./summary-card";
import { TopCategoriesCard } from "./top-categories-card";

export function InsightsDashboard() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { data: session } = useSession();

  const { data, isPending: isInsightsPending, isPlaceholderData, isError } = useInsights({
    params: { year, currency },
    queryConfig: { enabled: !!session },
  });
  const isPending = !!session && isInsightsPending;

  const { data: breakdownData } = useBreakdown({
    params: { year, currency },
    queryConfig: { enabled: !!session },
  });

  const monthly = (session ? data?.monthly : undefined) ?? MONTHS.map((_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
    balance: 0,
  }));

  const from = startOfYear(new Date(year, 0)).toISOString();
  const to = endOfYear(new Date(year, 0)).toISOString();

  const { data: summaryDataRaw, isPending: isSummaryPendingRaw } = useCategorySummary({
    params: { from, to },
    queryConfig: { enabled: !!session },
  });
  const isSummaryPending = !!session && isSummaryPendingRaw;
  const summaryData = session ? summaryDataRaw : undefined;

  const chartData = monthly.map(m => ({
    month: MONTHS[m.month - 1],
    income: m.income,
    expense: m.expense,
  }));

  return (
    <div className="relative flex flex-col gap-4">
      {!session && (
        <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/70 to-background" />
          <div className="absolute inset-0 mask-[linear-gradient(to_bottom,transparent_20%,black_60%)] backdrop-blur-sm" />
          <div className="absolute left-0 right-0 flex flex-col items-center gap-2 text-center pb-16 max-sm:top-1/3 sm:bottom-1/3">
            <p className="text-sm font-semibold">Sign in to view insights</p>
            <p className="text-xs text-muted-foreground max-w-56">Your financial insights are only available when signed in.</p>
            <LoginDialog triggerProps={{ size: "sm", className: "rounded-full mt-1" }} />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <CurrencyToggle value={currency} onChangeAction={setCurrency} />

        <Select
          value={year.toString()}
          onValueChange={v => setYear(Number(v))}
          items={YEARS.map(y => ({ value: y.toString(), label: y.toString() }))}
        >
          <SelectTrigger className="relative h-9 rounded-full bg-muted border-0 shadow-none px-4 text-sm w-auto gap-1.5 [&_svg]:size-3.5">
            <Shimmer isPending={!!session && isPlaceholderData} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" alignItemWithTrigger={false}>
            <SelectGroup>
              {YEARS.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isError
        ? <ErrorState />
        : (
            <>
              <div className="grid sm:grid-cols-3 gap-x-3 gap-y-4">
                <SummaryCard
                  title="Total Balance"
                  icon={Money01Icon}
                  values={monthly.map(m => m.balance)}
                  color="bg-blue-500 dark:bg-blue-500/80"
                  currency={currency}
                  isPending={isPending}
                />
                <SummaryCard
                  title="Income"
                  icon={ArrowDownLeft01Icon}
                  values={monthly.map(m => m.income)}
                  color="bg-primary dark:bg-primary/80"
                  currency={currency}
                  isPending={isPending}
                />
                <SummaryCard
                  title="Expense"
                  icon={ArrowUpRight01Icon}
                  values={monthly.map(m => m.expense)}
                  color="bg-destructive dark:bg-destructive/80"
                  currency={currency}
                  isPending={isPending}
                  invertChange
                />
              </div>

              <InsightCard title={(
                <>
                  <Icon icon={Chart03Icon} className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Income vs Expenses</span>
                </>
              )}
              >
                <MintAreaChart
                  data={chartData}
                  series={[
                    { key: "income", label: "Income", color: "var(--primary)" },
                    { key: "expense", label: "Expense", color: "var(--destructive)" },
                  ]}
                  className="h-48 w-full"
                />
              </InsightCard>

              <div className="grid sm:grid-cols-2 gap-x-3 gap-y-4">
                <SavingsRateCard
                  monthly={monthly}
                  breakdown={breakdownData?.monthly ?? MONTHS.map((_, i) => ({ month: i + 1, incomeCategories: [] }))}
                  currency={currency}
                  isPending={isPending}
                />
                <TopCategoriesCard
                  categories={summaryData?.categories ?? []}
                  isPending={isSummaryPending}
                />
              </div>
            </>
          )}
    </div>
  );
}
