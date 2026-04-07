import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/utils/constants";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

type WalletSummary = {
  id: string;
  name: string;
  currency: Currency;
  type: "cash" | "bank" | "savings";
};

export type WalletTransfer = {
  id: string;
  userId: string;
  fromWalletId: string;
  toWalletId: string;
  fromAmount: string;
  toAmount: string;
  note: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  fromWallet: WalletSummary;
  toWallet: WalletSummary;
};

type GetWalletTransfersParams = {
  walletId: string;
  from?: string;
  to?: string;
};

export async function getWalletTransfers({ walletId, from, to }: GetWalletTransfersParams): Promise<WalletTransfer[]> {
  const res = await client.api.wallets[":id"].transfers.$get({
    param: { id: walletId },
    query: { from, to },
  });
  if (!res.ok)
    throw new Error("Failed to fetch wallet transfers");
  return res.json();
}

export function getWalletTransfersQueryOptions(params?: GetWalletTransfersParams) {
  return queryOptions({
    queryKey: ["wallet-transfers", ...(params ? [params] : [])],
    queryFn: params ? () => getWalletTransfers(params) : undefined,
  });
}

type UseWalletTransfersOptions = {
  params: GetWalletTransfersParams;
  queryConfig?: QueryConfig<typeof getWalletTransfersQueryOptions>;
};

export function useWalletTransfers({ params, queryConfig }: UseWalletTransfersOptions) {
  return useQuery({
    ...getWalletTransfersQueryOptions(params),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
