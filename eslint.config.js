import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
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
