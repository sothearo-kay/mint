import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { getSettingsQueryOptions } from "./get-settings";

export type UpdateSettingsInput = {
  budgetLimitUSD?: string | null;
  budgetLimitKHR?: string | null;
};

export async function updateSettings(body: UpdateSettingsInput) {
  const res = await client.api.settings.$put({ json: body });
  if (!res.ok)
    throw new Error("Failed to update settings");
  return res.json();
}

type UseUpdateSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateSettings>;
};

export function useUpdateSettings({ mutationConfig }: UseUpdateSettingsOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getSettingsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateSettings,
  });
}
