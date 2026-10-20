import { defineConfig } from "oxfmt";

export default defineConfig({
 tabWidth: 1,
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
 sortPackageJson: false,
 astro: true,
 associations: [
  {
   files: ["*.astro"],
   language: "astro",
  },
 ],
 ignorePatterns: [
  "dist/",
  "node_modules/",
  ".astro/",
  ".wrangler/",
  "package-lock.json",
  "pnpm-lock.yaml",
  "flake.lock",
  "result",
 ],
});
