import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

export type TransactionsPage = {
  data: Transaction[];
  nextCursor: string | null;
  totals: {
    income: { USD: string; KHR: string };
    expense: { USD: string; KHR: string };
  };
};

type GetTransactionsParams = {
  type?: TransactionType;
  categoryId?: string;
  from?: string;
  to?: string;
  walletId?: string;
  cursor?: string;
  limit?: number;
};

async function getTransactions(params: GetTransactionsParams = {}): Promise<TransactionsPage> {
  const res = await client.api.transactions.$get({ query: params });
  if (!res.ok)
    throw new Error("Failed to fetch transactions");
  return res.json();
}

export function getTransactionsQueryOptions(params: GetTransactionsParams = {}) {
  return queryOptions({
    queryKey: ["transactions", ...(Object.keys(params).length ? [params] : [])],
    queryFn: () => getTransactions(params),
  });
}

type UseTransactionsOptions = {
  params?: GetTransactionsParams;
  queryConfig?: Omit<QueryConfig<typeof getTransactionsQueryOptions>, "select">;
};

export function useTransactions({ params, queryConfig }: UseTransactionsOptions = {}) {
  return useQuery({
    ...getTransactionsQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
    select: page => page.data,
  });
}

type UseInfiniteTransactionsOptions = {
  params?: Omit<GetTransactionsParams, "cursor">;
  enabled?: boolean;
};

export function useInfiniteTransactions({ params, enabled }: UseInfiniteTransactionsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["transactions", "infinite", ...(params && Object.keys(params).length ? [params] : [])],
    queryFn: ({ pageParam }) => getTransactions({ ...params, cursor: pageParam ?? undefined }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null as string | null,
    placeholderData: keepPreviousData,
    enabled,
  });
}
