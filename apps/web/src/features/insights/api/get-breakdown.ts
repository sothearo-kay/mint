import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type MonthlyBreakdown = {
  month: number;
  incomeCategories: { id: string; name: string; icon: string; amount: string }[];
};

type GetBreakdownParams = {
  year?: number;
  currency?: Currency;
};

async function getBreakdown(params: GetBreakdownParams = {}): Promise<{ monthly: MonthlyBreakdown[] }> {
  const res = await client.api.insights.breakdown.$get({
    query: { year: params.year ? String(params.year) : undefined, currency: params.currency },
  });
  if (!res.ok)
    throw new Error("Failed to fetch insights breakdown");
  return res.json();
}

export function getBreakdownQueryOptions(params: GetBreakdownParams = {}) {
  return queryOptions({
    queryKey: ["insights-breakdown", ...(params && Object.keys(params).length ? [params] : [])],
    queryFn: () => getBreakdown(params),
  });
}

type UseBreakdownOptions = {
  params?: GetBreakdownParams;
  queryConfig?: QueryConfig<typeof getBreakdownQueryOptions>;
};

export function useBreakdown({ params, queryConfig }: UseBreakdownOptions = {}) {
  return useQuery({
    ...getBreakdownQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
