import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import mdx from "eslint-plugin-mdx";
import _import from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import parser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ["**/*.md", "**/*.d.ts"],
	},
	...fixupConfigRules(
		compat.extends(
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
			"plugin:@typescript-eslint/recommended-requiring-type-checking",
			"plugin:mdx/recommended",
			"plugin:astro/recommended",
			"plugin:astro/jsx-a11y-recommended",
			"plugin:import/recommended",
			"plugin:import/typescript",
			"prettier",
		),
	),
	{
		plugins: {
			"@typescript-eslint": fixupPluginRules(typescriptEslint),
			mdx: fixupPluginRules(mdx),
			import: fixupPluginRules(_import),
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 5,
			sourceType: "script",

			parserOptions: {
				project: "./tsconfig.json",
				extraFileExtensions: [".astro"],

				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			"import/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx"],
				"astro-eslint-parser": [".astro"],
			},

			"import/resolver": {
				typescript: {},
			},
		},

		rules: {
			"import/prefer-default-export": "off",
		},
	},
	{
		files: ["**/*.astro"],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: "script",

			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
		},
	},
];
