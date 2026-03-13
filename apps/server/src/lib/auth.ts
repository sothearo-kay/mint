import { db } from "@mint/db";
import * as schema from "@mint/db/schema";
import { env } from "@mint/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BASE_URL,
  trustedOrigins: [env.BETTER_AUTH_TRUSTED_ORIGIN],
  advanced: {
    ...(env.COOKIE_DOMAIN && {
      crossSubDomainCookies: {
        enabled: true,
        domain: env.COOKIE_DOMAIN,
      },
    }),
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});
