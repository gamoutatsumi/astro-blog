import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import expressiveCode from "astro-expressive-code";
import mcp from "astro-mcp";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";
import remarkBudoux from "remark-budoux";
import remarkDirective from "remark-directive";
import remarkLinkCard from "remark-link-card-plus";
import UnoCSS from "unocss/astro";
import { remarkAdmonitions } from "./src/lib/remark/admonitions";
import { remarkFigure } from "./src/lib/remark/figure";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  build: {
    format: "file",
  },
  image: { responsiveStyles: true, layout: "constrained" },
  site: "https://blog.gamou.dev",
  vite: {
    server: {
      fs: {
        // Allow serving files from Nix store (for dev toolbar in Nix environment)
        allow: ["/nix/store"],
      },
    },
  },
  markdown: {
    remarkPlugins: [
      [
        remarkLinkCard,
        {
          cache: false,
          shortenUrl: true,
          thumbnailPosition: "right",
        },
      ],
      remarkBudoux,
      remarkDirective,
      remarkAdmonitions,
      remarkFigure,
    ],
    syntaxHighlight: false,
    gfm: true,
  },
  integrations: [
    pagefind(),
    UnoCSS({ injectReset: true, configFile: "./uno.config.ts" }),
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
    mcp({ editor: "cursor" }),
    expressiveCode({ plugins: [pluginLineNumbers] }),
  ],
});
