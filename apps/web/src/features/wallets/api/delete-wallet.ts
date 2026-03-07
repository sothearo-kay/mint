import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getWalletsQueryOptions } from "./get-wallets";

export async function deleteWallet(id: string) {
  const res = await client.api.wallets[":id"].$delete({ param: { id } });
  if (!res.ok)
    throw new Error("Failed to delete wallet");
}

type UseDeleteWalletOptions = {
  mutationConfig?: MutationConfig<typeof deleteWallet>;
};

export function useDeleteWallet({ mutationConfig }: UseDeleteWalletOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
