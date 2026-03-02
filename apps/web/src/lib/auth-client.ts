import { env } from "@mint/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
});
