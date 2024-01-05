import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), mdx(), react()],
  adapter: vercel({
    // includeFiles: ["src/pages/mickey/metadata.json"],
  }),
});
