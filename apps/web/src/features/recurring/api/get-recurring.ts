import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type RecurringTransaction = {
  id: string;
  userId: string;
  walletId: string | null;
  categoryId: string;
  name: string;
  amount: string;
  type: "income" | "expense";
  currency: Currency;
  logo: string | null;
  note: string | null;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string | null;
  nextScheduledDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
};

export async function getRecurring(): Promise<RecurringTransaction[]> {
  const res = await client.api.recurring.$get();
  if (!res.ok)
    throw new Error("Failed to fetch recurring transactions");
  return res.json();
}

export function getRecurringQueryOptions() {
  return queryOptions({
    queryKey: ["recurring"],
    queryFn: getRecurring,
  });
}

type UseRecurringOptions = {
  queryConfig?: QueryConfig<typeof getRecurringQueryOptions>;
};

export function useRecurring({ queryConfig }: UseRecurringOptions = {}) {
  return useQuery({
    ...getRecurringQueryOptions(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
