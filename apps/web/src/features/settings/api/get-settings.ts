import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export type Settings = {
  budgetLimitUSD: string | null;
  budgetLimitKHR: string | null;
};

export async function getSettings(): Promise<Settings> {
  const res = await client.api.settings.$get();
  if (!res.ok)
    throw new Error("Failed to fetch settings");
  return res.json();
}

export function getSettingsQueryOptions() {
  return queryOptions({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

type UseSettingsOptions = {
  queryConfig?: QueryConfig<typeof getSettingsQueryOptions>;
};

export function useSettings({ queryConfig }: UseSettingsOptions = {}) {
  return useQuery({
    ...getSettingsQueryOptions(),
    ...queryConfig,
  });
}
