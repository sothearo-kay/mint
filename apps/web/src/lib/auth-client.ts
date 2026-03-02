import { env } from "@mint/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/auth`,
  sessionOptions: {
    refetchOnWindowFocus: false,
    refetchInterval: 0,
  },
});

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
