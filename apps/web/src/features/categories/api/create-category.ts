import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/api-client";
import { getCategoriesQueryOptions } from "../../transactions/api/get-categories";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export async function createCategory(body: CreateCategoryInput) {
  const res = await client.api.categories.$post({ json: body });
  if (!res.ok)
    throw new Error("Failed to create category");
  return res.json();
}

type UseCreateCategoryOptions = {
  mutationConfig?: MutationConfig<typeof createCategory>;
};

export function useCreateCategory({ mutationConfig }: UseCreateCategoryOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getCategoriesQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCategory,
  });
}
