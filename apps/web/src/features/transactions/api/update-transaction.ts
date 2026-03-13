import type { z } from "zod";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { createTransactionSchema } from "./create-transaction";
import { invalidateTransactionQueries } from "./invalidate-queries";

export const updateTransactionSchema = createTransactionSchema.partial();
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export async function updateTransaction({ id, ...body }: UpdateTransactionInput & { id: string }) {
  const res = await client.api.transactions[":id"].$patch({ param: { id }, json: body });
  if (!res.ok)
    throw new Error("Failed to update transaction");
  return res.json();
}

type UseUpdateTransactionOptions = {
  mutationConfig?: MutationConfig<typeof updateTransaction>;
};

export function useUpdateTransaction({ mutationConfig }: UseUpdateTransactionOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      invalidateTransactionQueries(queryClient);
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateTransaction,
  });
}
