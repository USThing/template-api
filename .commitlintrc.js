export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Dependabot or we like long headers...
    "header-max-length": [0, "always", 0],
    // allow long commit bodies (links / long explanations)
    "body-max-line-length": [0, "always", 0],
  },
};
