// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    languageOptions: {
      globals: {
        Astro: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description",
        },
      ],
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
      "astro/jsx-a11y/anchor-has-content": "warn",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", ".wrangler/**"],
  },
  eslintConfigPrettier,
];
