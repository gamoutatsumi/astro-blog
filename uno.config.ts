import {
	defineConfig,
	presetIcons,
	presetMini,
	presetTypography,
	presetWebFonts,
} from "unocss";

export default defineConfig({
	rules: [
		["object-cover", { "object-fit": "cover" }],
		["object-container", { "object-fit": "contain" }],
	],
	presets: [presetIcons(), presetMini(), presetWebFonts(), presetTypography()],
});
