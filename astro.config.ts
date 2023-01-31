import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import partytown from "@astrojs/partytown";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gamou.dev",
  integrations: [
    react(),
    mdx(),
    sitemap({
      customPages: ["https://blog.gamou.dev"],
      serialize(item) {
        if (/\/posts\/nsfw/.test(item.url)) {
          return undefined;
        }
        return item;
      },
    }),
    partytown({
      config: {},
    }),
    image({ serviceEntryPoint: "@astrojs/image/sharp" }),
  ],
});
