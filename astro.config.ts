import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import mcp from "astro-mcp";
import pagefind from "astro-pagefind";
import remarkDirective from "remark-directive";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
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
		remarkPlugins: [remarkDirective],
		syntaxHighlight: "shiki",
		gfm: true,
	},
	integrations: [
		pagefind(),
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
		mcp({ editor: "cursor" }),
	],
});
