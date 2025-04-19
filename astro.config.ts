// https://astro.build/config
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
import partytown from "@astrojs/partytown";

import UnoCSS from "unocss/astro";

import mcp from "astro-mcp";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gamou.dev",
  integrations: [
    UnoCSS({ injectReset: true }),
    sitemap({
      customPages: ["https://blog.gamou.dev"],
      serialize(item) {
        if (/\/nsfw/.test(item.url)) {
          return undefined;
        }
        return item;
      },
    }),
    partytown({
      config: {},
    }),
    mcp(),
  ],
});
