import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: string;
  currency: Currency;
  note: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
    type: TransactionType;
  };
  walletId: string | null;
  recurring: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
};

type GetTransactionsParams = {
  type?: "income" | "expense";
  categoryId?: string;
  from?: string;
  to?: string;
  walletId?: string;
};

export async function getTransactions(params: GetTransactionsParams = {}): Promise<Transaction[]> {
  const res = await client.api.transactions.$get({ query: params });
  if (!res.ok)
    throw new Error("Failed to fetch transactions");
  return res.json();
}

export function getTransactionsQueryOptions(params: GetTransactionsParams = {}) {
  return queryOptions({
    queryKey: ["transactions", ...(params && Object.keys(params).length ? [params] : [])],
    queryFn: () => getTransactions(params),
  });
}

type UseTransactionsOptions = {
  params?: GetTransactionsParams;
  queryConfig?: QueryConfig<typeof getTransactionsQueryOptions>;
};

export function useTransactions({ params, queryConfig }: UseTransactionsOptions = {}) {
  return useQuery({
    ...getTransactionsQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
