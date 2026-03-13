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

export async function getWalletTransfers(walletId: string): Promise<WalletTransfer[]> {
  const res = await client.api.wallets[":id"].transfers.$get({ param: { id: walletId } });
  if (!res.ok)
    throw new Error("Failed to fetch wallet transfers");
  return res.json();
}

export function getWalletTransfersQueryOptions(walletId?: string) {
  return queryOptions({
    queryKey: ["wallet-transfers", ...(walletId ? [walletId] : [])],
    queryFn: walletId ? () => getWalletTransfers(walletId) : undefined,
  });
}

type UseWalletTransfersOptions = {
  walletId: string;
  queryConfig?: QueryConfig<typeof getWalletTransfersQueryOptions>;
};

export function useWalletTransfers({ walletId, queryConfig }: UseWalletTransfersOptions) {
  return useQuery({
    ...getWalletTransfersQueryOptions(walletId),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });
}
