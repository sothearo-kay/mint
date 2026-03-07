import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { getWalletsQueryOptions } from "./get-wallets";

export const createWalletSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  currency: z.enum(["USD", "KHR"]),
  type: z.enum(["cash", "bank", "savings"]).default("cash"),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;

export async function createWallet(body: CreateWalletInput) {
  const res = await client.api.wallets.$post({ json: body });
  if (!res.ok)
    throw new Error("Failed to create wallet");
  return res.json();
}

type UseCreateWalletOptions = {
  mutationConfig?: MutationConfig<typeof createWallet>;
};

export function useCreateWallet({ mutationConfig }: UseCreateWalletOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createWallet,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
