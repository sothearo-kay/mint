import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc31("/openapi.json", {
    openapi: "3.1.0",
    info: {
      version: "0.0.0",
      title: "Mint API",
      description: "A minimalist expense tracker API",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  });

  app.get(
    "/docs",
    Scalar({
      url: "/openapi.json",
      pageTitle: "Mint API",
    }),
  );
}
