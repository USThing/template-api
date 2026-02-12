// sort-imports-ignore
import globals from "globals";

import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import pluginPrettier from "eslint-config-prettier/flat";

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
  pluginPrettier,
];
