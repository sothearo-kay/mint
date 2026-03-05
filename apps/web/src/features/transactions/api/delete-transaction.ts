import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getTransactionsQueryOptions } from "./get-transactions";

export async function deleteTransaction(id: string) {
  const res = await client.api.transactions[":id"].$delete({ param: { id } });
  if (!res.ok)
    throw new Error("Failed to delete transaction");
}

type UseDeleteTransactionOptions = {
  mutationConfig?: MutationConfig<typeof deleteTransaction>;
};

export function useDeleteTransaction({ mutationConfig }: UseDeleteTransactionOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTransactionsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteTransaction,
  });
}
