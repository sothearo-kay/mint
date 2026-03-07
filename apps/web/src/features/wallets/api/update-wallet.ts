import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { getWalletsQueryOptions } from "./get-wallets";

export const updateWalletSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  type: z.enum(["cash", "bank", "savings"]).optional(),
});

export type UpdateWalletInput = z.infer<typeof updateWalletSchema> & { id: string };

export async function updateWallet({ id, ...body }: UpdateWalletInput) {
  const res = await client.api.wallets[":id"].$patch({ param: { id }, json: body });
  if (!res.ok)
    throw new Error("Failed to update wallet");
  return res.json();
}

type UseUpdateWalletOptions = {
  mutationConfig?: MutationConfig<typeof updateWallet>;
};

export function useUpdateWallet({ mutationConfig }: UseUpdateWalletOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: updateWallet,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
