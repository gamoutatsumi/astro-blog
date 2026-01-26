/** @type {import("prettier").Config} */
export default {
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
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
