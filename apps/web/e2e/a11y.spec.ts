// Accessibility check of every portal page with axe (the tool behind
// Lighthouse's accessibility score): colour contrast, names on buttons and
// links, image alt text, form labels, headings, landmarks and target sizes,
// to WCAG 2.2 AA. Every page, in light and dark mode.

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { catalog } from "@/shared/catalog/catalogIndex";
import { openPage, usePrefs } from "./support/openPage";

// Every address: each screen (sample record for `:id`), the role home and the showcase.
const PATHS = ["/home", "/design-system", ...catalog.allScreens().map((s) => catalog.hrefOf(s))];

for (const theme of ["light", "dark"] as const) {
  test(`every page passes axe (WCAG 2.2 AA) in ${theme} mode`, async ({ page }) => {
    await usePrefs(page, { theme });
    const failures: string[] = [];
    for (const path of PATHS) {
      // Step 1: open the page.
      await openPage(page, path);
      // Step 2: run axe with the WCAG A and AA rules up to 2.2.
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      // Step 3: keep one line per broken rule, naming the page and the first element.
      for (const v of result.violations) failures.push(`${path}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(" ")}`);
    }
    // Step 4: one report of everything, so it can all be fixed at once.
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
