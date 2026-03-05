import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/lib/auth-client";

export async function signOutUser() {
  const { error } = await signOut();
  if (error)
    throw new Error(error.message ?? "Failed to sign out");
}

type UseSignOutOptions = {
  mutationConfig?: MutationConfig<typeof signOutUser>;
};

export function useSignOut({ mutationConfig }: UseSignOutOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: signOutUser,
    onSuccess: (...args) => {
      queryClient.clear();
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
