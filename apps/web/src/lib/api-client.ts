import apiClient from "@mint/api-client";
import { env } from "@mint/env/web";

export const client = apiClient(env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080", {
  init: {
    credentials: "include",
  },
});
