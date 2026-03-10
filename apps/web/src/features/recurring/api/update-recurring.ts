import type { CreateRecurringInput } from "./create-recurring";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getRecurringQueryOptions } from "./get-recurring";

export type UpdateRecurringInput = { id: string } & Partial<CreateRecurringInput>;

export async function updateRecurring({ id, ...body }: UpdateRecurringInput) {
  const res = await client.api.recurring[":id"].$patch({ param: { id }, json: body });
  if (!res.ok)
    throw new Error("Failed to update recurring transaction");
  return res.json();
}

type UseUpdateRecurringOptions = {
  mutationConfig?: MutationConfig<typeof updateRecurring>;
};

export function useUpdateRecurring({ mutationConfig }: UseUpdateRecurringOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: updateRecurring,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getRecurringQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
