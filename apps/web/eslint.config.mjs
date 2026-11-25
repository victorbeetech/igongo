// Lint rules for the web portal: Next.js core web vitals and TypeScript.
// `pnpm lint` runs with --max-warnings 0, so every warning fails.

import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTs,
  {
    rules: {
      // No console output in committed code (code standards, rule 6).
      "no-console": "error",
    },
  },
  { ignores: [".next/**", "public/brand/**", "next-env.d.ts"] },
];

export default config;
