import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/dist/**"] },
  js.configs.recommended,
  {
    files: ["server/**/*.js", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["client/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["client/**/*.jsx"],
    extends: [reactHooks.configs.flat.recommended],
  },
]);
