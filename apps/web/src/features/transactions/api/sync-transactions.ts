import type { CreateTransactionInput } from "./create-transaction";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getTransactionsQueryOptions } from "./get-transactions";

export async function syncTransactions(transactions: CreateTransactionInput[]) {
  const res = await client.api.transactions.sync.$post({ json: transactions });
  if (!res.ok)
    throw new Error("Failed to sync transactions");
}

type UseSyncTransactionsOptions = {
  mutationConfig?: MutationConfig<typeof syncTransactions>;
};

export function useSyncTransactions({ mutationConfig }: UseSyncTransactionsOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: syncTransactions,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getTransactionsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
