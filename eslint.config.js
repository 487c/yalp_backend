import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    env: { mocha: true },
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
];
