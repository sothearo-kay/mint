import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/lib/auth-client";

export async function signInWithGoogle(callbackURL: string) {
  const { error } = await signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}${callbackURL}`,
    errorCallbackURL: `${window.location.origin}${callbackURL}`,
  });
  if (error)
    throw new Error(error.message ?? "Failed to sign in");
}

export async function signInWithGithub(callbackURL: string) {
  const { error } = await signIn.social({
    provider: "github",
    callbackURL: `${window.location.origin}${callbackURL}`,
    errorCallbackURL: `${window.location.origin}${callbackURL}`,
  });
  if (error)
    throw new Error(error.message ?? "Failed to sign in");
}

type UseSignInOptions = {
  mutationConfig?: MutationConfig<typeof signInWithGoogle>;
};

export function useSignIn({ mutationConfig }: UseSignInOptions = {}) {
  return useMutation({
    mutationFn: signInWithGoogle,
    ...mutationConfig,
  });
}

type UseSignInWithGithubOptions = {
  mutationConfig?: MutationConfig<typeof signInWithGithub>;
};

export function useSignInWithGithub({ mutationConfig }: UseSignInWithGithubOptions = {}) {
  return useMutation({
    mutationFn: signInWithGithub,
    ...mutationConfig,
  });
}
