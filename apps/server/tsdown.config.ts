import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/app.ts"],
  format: "esm",
  outDir: "dist",
  clean: true,
  dts: true,
  noExternal: [/^@mint\//],
});
