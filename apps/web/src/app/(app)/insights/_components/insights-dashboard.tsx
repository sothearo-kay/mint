"use client";

import { ArrowDownLeft01Icon, ArrowUpRight01Icon, Chart03Icon, Money01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@mint/ui/components/select";
import { MintAreaChart } from "@mint/ui/components/ui/area-chart";
import { Shimmer } from "@mint/ui/components/ui/shimmer";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { endOfYear, startOfYear } from "date-fns";
import { useState } from "react";
import { MintCard } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { ToggleGroup } from "@/components/toggle-group";
import { useSession } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useCategorySummary } from "@/features/categories/api/get-summary";
import { useBreakdown } from "@/features/insights/api/get-breakdown";
import { useInsights } from "@/features/insights/api/get-insights";
import { useCurrencyStore } from "@/store/currency";
import { CURRENT_YEAR, MONTHS, YEARS } from "@/utils/constants";
import { formatBalanceAmount } from "@/utils/format";
import { InsightSummaryCard } from "./insight-summary-card";
import { SavingsRateCard } from "./savings-rate-card";
import { TopCategoriesCard } from "./top-categories-card";

export function InsightsDashboard() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const { currency, setCurrency } = useCurrencyStore();
  const { data: session, isPending: isSessionPending } = useSession();

  const { data, isPending: isInsightsPending, isPlaceholderData, isError } = useInsights({
    params: { year, currency },
    queryConfig: { enabled: !!session },
  });
  const isPending = isSessionPending || (!!session && isInsightsPending);

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
  const prevDecember = session ? data?.prevDecember : undefined;

  const from = startOfYear(new Date(year, 0)).toISOString();
  const to = endOfYear(new Date(year, 0)).toISOString();

  const { data: summaryDataRaw, isPending: isSummaryPendingRaw } = useCategorySummary({
    params: { from, to, currency },
    queryConfig: { enabled: !!session },
  });
  const isSummaryPending = isSessionPending || (!!session && isSummaryPendingRaw);
  const summaryData = session ? summaryDataRaw : undefined;

  const totalIncome = monthly.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthly.reduce((sum, m) => sum + m.expense, 0);
  const netCashFlow = totalIncome - totalExpense;

  const chartData = monthly.map(m => ({
    month: MONTHS[m.month - 1],
    income: m.income,
    expense: m.expense,
  }));

  return (
    <div className="relative flex flex-col gap-4">
      {!isSessionPending && !session && (
        <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/70 to-background" />
          <div className="absolute inset-0 mask-[linear-gradient(to_bottom,transparent_20%,black_60%)] backdrop-blur-sm" />
          <div className="absolute left-0 right-0 flex flex-col items-center gap-2 text-center pb-16 max-sm:top-1/3 sm:bottom-1/3">
            <EmptyState
              title="Sign in to view insights"
              description="Your financial insights are only available when signed in."
            >
              <LoginDialog triggerProps={{ size: "sm", className: "rounded-full mt-1" }} />
            </EmptyState>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <ToggleGroup
          items={[
            { value: "USD", label: "USD" },
            { value: "KHR", label: "KHR" },
          ]}
          value={currency}
          onChangeAction={setCurrency}
          variant="pill"
        />

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
                <InsightSummaryCard
                  key={`balance-${year}`}
                  title="Total Balance"
                  icon={Money01Icon}
                  values={monthly.map(m => m.balance)}
                  color="bg-blue-500 dark:bg-blue-500/80"
                  currency={currency}
                  selectedYear={year}
                  prevDecemberValue={prevDecember?.balance}
                  isPending={isPending}
                />
                <InsightSummaryCard
                  key={`income-${year}`}
                  title="Income"
                  icon={ArrowDownLeft01Icon}
                  values={monthly.map(m => m.income)}
                  color="bg-primary dark:bg-primary/80"
                  currency={currency}
                  selectedYear={year}
                  prevDecemberValue={prevDecember?.income}
                  isPending={isPending}
                />
                <InsightSummaryCard
                  key={`expense-${year}`}
                  title="Expense"
                  icon={ArrowUpRight01Icon}
                  values={monthly.map(m => m.expense)}
                  color="bg-destructive dark:bg-destructive/80"
                  currency={currency}
                  selectedYear={year}
                  prevDecemberValue={prevDecember?.expense}
                  isPending={isPending}
                  invertChange
                />
              </div>

              <MintCard title={(
                <>
                  <Icon icon={Chart03Icon} className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Income vs Expenses</span>
                </>
              )}
              >
                {isPending
                  ? <Skeleton className="h-4 w-40 mb-3 rounded-md" />
                  : (
                      <p className="text-xs text-muted-foreground mb-3">
                        {netCashFlow !== 0
                          ? (
                              <>
                                <span
                                  className="size-1.5 rounded-full shrink-0 inline-block mr-1.5 -translate-y-px"
                                  style={{ background: netCashFlow >= 0 ? "var(--primary)" : "var(--destructive)" }}
                                />
                                {netCashFlow >= 0 ? "Saved" : "Overspent by"}
                                {" "}
                                <span className="font-semibold text-foreground tabular-nums">{formatBalanceAmount(Math.abs(netCashFlow), currency)}</span>
                                {" this year"}
                              </>
                            )
                          : `No data yet for ${year}`}
                      </p>
                    )}

                <MintAreaChart
                  data={chartData}
                  series={[
                    { key: "income", label: "Income", color: "var(--primary)" },
                    { key: "expense", label: "Expense", color: "var(--destructive)" },
                  ]}
                  className="h-48 w-full"
                  valueFormatter={v => formatBalanceAmount(Number(v), currency)}
                />
              </MintCard>

              <div className="grid sm:grid-cols-2 gap-x-3 gap-y-4">
                <SavingsRateCard
                  key={`savings-${year}`}
                  monthly={monthly}
                  breakdown={breakdownData?.monthly ?? MONTHS.map((_, i) => ({ month: i + 1, incomeCategories: [] }))}
                  currency={currency}
                  selectedYear={year}
                  prevDecember={prevDecember}
                  isPending={isPending}
                />
                <TopCategoriesCard
                  categories={summaryData?.categories ?? []}
                  isPending={isSummaryPending}
                  currency={currency}
                />
              </div>
            </>
          )}
    </div>
  );
}
