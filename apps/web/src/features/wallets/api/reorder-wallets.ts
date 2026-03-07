import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getWalletsQueryOptions } from "./get-wallets";

type ReorderItem = { id: string; position: number };

export async function reorderWallets(order: ReorderItem[]) {
  const res = await client.api.wallets.reorder.$patch({ json: { order } });
  if (!res.ok)
    throw new Error("Failed to reorder wallets");
}

type UseReorderWalletsOptions = {
  mutationConfig?: MutationConfig<typeof reorderWallets>;
};

export function useReorderWallets({ mutationConfig }: UseReorderWalletsOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: reorderWallets,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
