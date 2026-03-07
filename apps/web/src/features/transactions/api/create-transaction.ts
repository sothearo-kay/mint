import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { invalidateTransactionQueries } from "./invalidate-queries";

export const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Amount is required"),
  currency: z.enum(["USD", "KHR"]),
  categoryId: z.string().min(1, "Category is required"),
  note: z.string().optional().nullable(),
  date: z.string(),
  walletId: z.string().nullable().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export async function createTransaction(body: CreateTransactionInput) {
  const res = await client.api.transactions.$post({ json: body });
  if (!res.ok)
    throw new Error("Failed to create transaction");
  return res.json();
}

type UseCreateTransactionOptions = {
  mutationConfig?: MutationConfig<typeof createTransaction>;
};

export function useCreateTransaction({ mutationConfig }: UseCreateTransactionOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      invalidateTransactionQueries(queryClient);
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTransaction,
  });
}
