import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type MonthlyInsight = {
  month: number;
  income: number;
  expense: number;
  balance: number;
};

type GetInsightsParams = {
  year?: number;
  currency?: Currency;
};

export async function getInsights(params: GetInsightsParams = {}): Promise<{ monthly: MonthlyInsight[] }> {
  const res = await client.api.insights.$get({
    query: { year: params.year ? String(params.year) : undefined, currency: params.currency },
  });
  if (!res.ok)
    throw new Error("Failed to fetch insights");
  return res.json();
}

export function getInsightsQueryOptions(params: GetInsightsParams = {}) {
  return queryOptions({
    queryKey: ["insights", ...(params && Object.keys(params).length ? [params] : [])],
    queryFn: () => getInsights(params),
  });
}

type UseInsightsOptions = {
  params?: GetInsightsParams;
  queryConfig?: QueryConfig<typeof getInsightsQueryOptions>;
};

export function useInsights({ params, queryConfig }: UseInsightsOptions = {}) {
  return useQuery({
    ...getInsightsQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
