import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  build: {
    assets: "_assets",
  },
  server: {
    port: 4321,
  },
});
