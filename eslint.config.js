import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import pluginTs from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["dist/"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_|^fastify$|^opts$|^request$|^reply$",
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
];
