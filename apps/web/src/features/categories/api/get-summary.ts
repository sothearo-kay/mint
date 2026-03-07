import type { QueryConfig } from "@/lib/react-query";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type CategorySummaryItem = {
  id: string;
  name: string;
  icon: string;
  amount: string;
};

export type CategorySummary = {
  income: string;
  expense: string;
  categories: CategorySummaryItem[];
};

type GetSummaryParams = {
  from?: string;
  to?: string;
};

export async function getCategorySummary(params: GetSummaryParams = {}): Promise<CategorySummary> {
  const res = await client.api.categories.summary.$get({ query: params });
  if (!res.ok)
    throw new Error("Failed to fetch category summary");
  return res.json();
}

export function getCategorySummaryQueryOptions(params: GetSummaryParams = {}) {
  return queryOptions({
    queryKey: ["categories", "summary", params],
    queryFn: () => getCategorySummary(params),
  });
}

type UseCategorySummaryOptions = {
  params?: GetSummaryParams;
  queryConfig?: QueryConfig<typeof getCategorySummaryQueryOptions>;
};

export function useCategorySummary({ params, queryConfig }: UseCategorySummaryOptions = {}) {
  return useQuery({
    ...getCategorySummaryQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
