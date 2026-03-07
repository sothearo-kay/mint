import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type Wallet = {
  id: string;
  userId: string;
  name: string;
  currency: Currency;
  type: "cash" | "bank" | "savings";
  position: number;
  balance: string;
  createdAt: string;
  updatedAt: string;
};

export async function getWallets(): Promise<Wallet[]> {
  const res = await client.api.wallets.$get();
  if (!res.ok)
    throw new Error("Failed to fetch wallets");
  return res.json();
}

export function getWalletsQueryOptions() {
  return queryOptions({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });
}

type UseWalletsOptions = {
  queryConfig?: QueryConfig<typeof getWalletsQueryOptions>;
};

export function useWallets({ queryConfig }: UseWalletsOptions = {}) {
  return useQuery({
    ...getWalletsQueryOptions(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
