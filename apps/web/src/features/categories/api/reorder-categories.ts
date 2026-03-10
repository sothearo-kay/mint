import type { MutationConfig } from "@/lib/react-query";
import { toast } from "@mint/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "@/features/transactions/api/get-categories";
import { client } from "@/lib/api-client";

type ReorderItem = { id: string; position: number };

export async function reorderCategories(order: ReorderItem[]) {
  const res = await client.api.categories.reorder.$patch({ json: { order } });
  if (!res.ok)
    throw new Error("Failed to reorder categories");
}

type UseReorderCategoriesOptions = {
  mutationConfig?: MutationConfig<typeof reorderCategories>;
};

export function useReorderCategories({ mutationConfig }: UseReorderCategoriesOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: reorderCategories,
    onError: () => {
      queryClient.invalidateQueries({ queryKey: getCategoriesQueryOptions().queryKey });
      toast.error("Failed to reorder categories. Please try again.");
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getCategoriesQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
