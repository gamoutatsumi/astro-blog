/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  printWidth: 80,
  trailingComma: "all",
  semi: true,
  singleQuote: false,
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: false,
  quoteProps: "as-needed",
  plugins: ["prettier-plugin-astro", "prettier-plugin-organize-imports"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
