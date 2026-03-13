import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getCategoriesQueryOptions } from "../../transactions/api/get-categories";

export async function deleteCategory(id: string) {
  const res = await client.api.categories[":id"].$delete({ param: { id } });
  if (!res.ok)
    throw new Error("Failed to delete category");
}

type UseDeleteCategoryOptions = {
  mutationConfig?: MutationConfig<typeof deleteCategory>;
};

export function useDeleteCategory({ mutationConfig }: UseDeleteCategoryOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getCategoriesQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCategory,
  });
}
