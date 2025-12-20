import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import mcp from "astro-mcp";
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
		mcp({ editor: "cursor" }),
	],
});
