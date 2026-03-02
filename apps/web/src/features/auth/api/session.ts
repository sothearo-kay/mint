import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export async function getSession() {
  const { data } = await authClient.getSession();
  return data;
}

export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: ["session"],
    queryFn: getSession,
  });
}

type UseSessionOptions = {
  queryConfig?: QueryConfig<typeof getSessionQueryOptions>;
};

export function useSession({ queryConfig }: UseSessionOptions = {}) {
  return useQuery({
    ...getSessionQueryOptions(),
    ...queryConfig,
  });
}
