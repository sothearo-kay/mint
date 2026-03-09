import type { Wallet } from "./get-wallets";
import type { MutationConfig } from "@/lib/react-query";
import { toast } from "@mint/ui/components/sonner";
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
  const { onSuccess, onMutate: _onMutate, ...restConfig } = mutationConfig ?? {};

  return useMutation<void, Error, ReorderItem[], { previous: Wallet[] | undefined }>({
    mutationFn: reorderWallets,
    onMutate: async (order) => {
      await queryClient.cancelQueries({ queryKey: getWalletsQueryOptions().queryKey });
      const previous = queryClient.getQueryData<Wallet[]>(getWalletsQueryOptions().queryKey);
      if (previous) {
        const reordered = order
          .sort((a, b) => a.position - b.position)
          .map(({ id }) => previous.find(w => w.id === id)!)
          .filter(Boolean);
        queryClient.setQueryData(getWalletsQueryOptions().queryKey, reordered);
      }
      return { previous };
    },
    onError: (_err, _order, context) => {
      if (context?.previous)
        queryClient.setQueryData(getWalletsQueryOptions().queryKey, context.previous);
      toast.error("Failed to reorder wallets. Please try again.");
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
