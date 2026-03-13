import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { getWalletTransfersQueryOptions } from "./get-wallet-transfers";
import { getWalletsQueryOptions } from "./get-wallets";

export const transferWalletSchema = z.object({
  fromWalletId: z.string(),
  toWalletId: z.string().min(1, "Select a destination wallet"),
  fromAmount: z.string().refine(v => Number(v) > 0, "Amount must be greater than 0"),
  toAmount: z.string().refine(v => Number(v) > 0, "Amount must be greater than 0"),
  note: z.string().optional(),
  date: z.string(),
});

export type TransferWalletInput = z.infer<typeof transferWalletSchema>;

export async function transferWallet(body: TransferWalletInput) {
  const res = await client.api.wallets.transfer.$post({ json: body });
  if (!res.ok)
    throw new Error("Failed to create transfer");
  return res.json();
}

type UseTransferWalletOptions = {
  mutationConfig?: MutationConfig<typeof transferWallet>;
};

export function useTransferWallet({ mutationConfig }: UseTransferWalletOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: transferWallet,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      queryClient.invalidateQueries({ queryKey: getWalletTransfersQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
