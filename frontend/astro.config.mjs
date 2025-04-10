import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  output: "static",
  build: {
    assets: "_assets",
  },
  server: {
    port: 4321,
  },
});
