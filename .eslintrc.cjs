module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "mdx", "import", "tailwindcss"],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:mdx/recommended",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "plugin:tailwindcss/recommended",
  ],
  rules: {
    "import/prefer-default-export": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx", ".astro"] },
    ],
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
      "astro-eslint-parser": [".astro"],
    },
    "import/resolver": { typescript: {} },
    tailwindcss: {
      config: "tailwind.config.cjs",
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".astro"],
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "react/no-unknown-property": "off",
      },
    },
  ],
};
