import { RuleConfigSeverity } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Dependabot or we like long headers...
    "header-max-length": [RuleConfigSeverity.Disabled, "always", 0],
  },
};
