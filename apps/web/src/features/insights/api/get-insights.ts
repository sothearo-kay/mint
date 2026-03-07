import type { QueryConfig } from "@/lib/react-query";
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
};

export async function getInsights(params: GetInsightsParams = {}): Promise<{ monthly: MonthlyInsight[] }> {
  const res = await client.api.insights.$get({
    query: { year: params.year ? String(params.year) : undefined },
  });
  if (!res.ok)
    throw new Error("Failed to fetch insights");
  return res.json();
}

export function getInsightsQueryOptions(params: GetInsightsParams = {}) {
  return queryOptions({
    queryKey: ["insights", params],
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
