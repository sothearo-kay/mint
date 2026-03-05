import type { TransactionType } from "./get-transactions";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type Category = {
  id: string;
  userId: string | null;
  name: string;
  icon: string;
  type: TransactionType;
  createdAt: string;
};

export async function getCategories(): Promise<Category[]> {
  const res = await client.api.categories.$get();
  if (!res.ok)
    throw new Error("Failed to fetch categories");
  return res.json();
}

export function getCategoriesQueryOptions() {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export function useCategories({ queryConfig }: UseCategoriesOptions = {}) {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
}
