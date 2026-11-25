// Lint rules for the API Worker: strict TypeScript rules.
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
  { ignores: ["dist/**", ".wrangler/**", "scripts/**", "node_modules/**"] },
);
