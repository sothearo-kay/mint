import apiClient from "@mint/api-client";
import { env } from "@mint/env/web";

export const client = apiClient(env.NEXT_PUBLIC_API_URL ?? "", {
  init: {
    credentials: "include",
  },
});
