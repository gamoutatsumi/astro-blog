import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    languageOptions: {
      globals: {
        Astro: "readonly",
      },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      "prefer-const": "off",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", ".wrangler/**"],
  },
  eslintConfigPrettier,
]);
