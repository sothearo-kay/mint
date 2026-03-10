import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { getRecurringQueryOptions } from "./get-recurring";

export const createRecurringSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["income", "expense"]),
  currency: z.enum(["USD", "KHR"]),
  categoryId: z.string().min(1, "Category is required"),
  walletId: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;

export async function createRecurring(body: CreateRecurringInput) {
  const res = await client.api.recurring.$post({ json: body });
  if (!res.ok)
    throw new Error("Failed to create recurring transaction");
  return res.json();
}

type UseCreateRecurringOptions = {
  mutationConfig?: MutationConfig<typeof createRecurring>;
};

export function useCreateRecurring({ mutationConfig }: UseCreateRecurringOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createRecurring,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getRecurringQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
