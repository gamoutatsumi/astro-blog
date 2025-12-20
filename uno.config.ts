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
		["clip-rect-0", { clip: "rect(0, 0, 0, 0)" }],
		["clip-auto", { clip: "auto" }],
	],
	shortcuts: {
		// Accessibility
		"sr-only":
			"absolute w-1px h-1px p-0 -m-1px overflow-hidden clip-rect-0 whitespace-nowrap border-0",
		"not-sr-only":
			"static w-auto h-auto p-0 m-0 overflow-visible clip-auto whitespace-normal",
		// Background
		"bg-base": "bg-slate-50 dark:bg-slate-900",
		"bg-surface": "bg-white dark:bg-slate-800",
		// Primary
		"bg-primary": "bg-blue-600 dark:bg-blue-500",
		"text-on-primary": "text-white",
		// Text
		"text-base": "text-slate-900 dark:text-slate-100",
		"text-muted": "text-slate-600 dark:text-slate-400",
		// Border
		"border-base": "border-slate-200 dark:border-slate-700",
		// Badges
		"badge-category":
			"px-2 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
		"badge-tag":
			"px-2 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
		// Footer
		"bg-footer": "bg-slate-800 dark:bg-slate-950",
	},
	presets: [
		presetIcons(),
		presetMini({
			dark: "class",
		}),
		presetWebFonts(),
		presetTypography(),
	],
});
