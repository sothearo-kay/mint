import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getRecurringQueryOptions } from "./get-recurring";

export async function deleteRecurring(id: string) {
  const res = await client.api.recurring[":id"].$delete({ param: { id } });
  if (!res.ok)
    throw new Error("Failed to delete recurring transaction");
}

type UseDeleteRecurringOptions = {
  mutationConfig?: MutationConfig<typeof deleteRecurring>;
};

export function useDeleteRecurring({ mutationConfig }: UseDeleteRecurringOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteRecurring,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getRecurringQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
