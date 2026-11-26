// Lint rules for the housekeeping API module: strict TypeScript rules.
// `pnpm lint` runs with --max-warnings 0, so every warning fails.

import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      // No console output in committed code (code standards, rule 6).
      "no-console": "error",
    },
  },
  { ignores: ["migrations/**", "node_modules/**"] },
);
