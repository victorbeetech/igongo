// Screenshot tests of the web portal: one page per layout kind, the screen
// states, the sidebar folded and searching, and the design system, in light
// and dark mode. Each is compared with the saved image in e2e/screenshots/;
// a change to the theme or a shared component fails here until the new
// images are reviewed and saved with `pnpm test:e2e --update-snapshots`.

import { expect, test } from "@playwright/test";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenKind } from "@/shared/catalog/types";
import { openPage, usePrefs } from "./support/openPage";

const KINDS: ScreenKind[] = ["home", "list", "detail", "form", "dashboard", "scanner", "map", "settings", "builder", "result"];
// The first web page of each kind, so every shared layout is covered.
const KEY_PAGES = KINDS.map((k) => catalog.allScreens().find((s) => s.kind === k && s.surfaces.includes("web"))!).filter(Boolean);
const LIST = KEY_PAGES.find((s) => s.kind === "list")!;

for (const theme of ["light", "dark"] as const) {
  test.describe(theme, () => {
    // Step 1: one page per layout kind.
    for (const spec of KEY_PAGES) {
      test(`${spec.kind}: ${spec.name}`, async ({ page }) => {
        await usePrefs(page, { theme });
        await openPage(page, catalog.hrefOf(spec));
        await expect(page).toHaveScreenshot(`${theme}/kind-${spec.kind}.png`, { fullPage: true });
      });
    }
    // Step 2: the screen states, on the first list page.
    for (const state of ["loading", "empty", "error", "denied", "success", "offline"]) {
      test(`state: ${state}`, async ({ page }) => {
        await usePrefs(page, { theme, state });
        await openPage(page, catalog.hrefOf(LIST));
        await expect(page).toHaveScreenshot(`${theme}/state-${state}.png`);
      });
    }
    // Step 3: the sidebar folded to icons, and searching deep pages.
    test("sidebar folded", async ({ page }) => {
      await usePrefs(page, { theme });
      await openPage(page, "/home");
      await page.getByRole("button", { name: "Close sidebar" }).click();
      await expect(page).toHaveScreenshot(`${theme}/sidebar-folded.png`);
    });
    test("sidebar search", async ({ page }) => {
      await usePrefs(page, { theme });
      await openPage(page, "/home");
      await page.getByRole("searchbox").fill("payslip");
      await expect(page).toHaveScreenshot(`${theme}/sidebar-search.png`);
    });
    // Step 4: the design system showcase, whole page.
    test("design system", async ({ page }) => {
      await usePrefs(page, { theme });
      await openPage(page, "/design-system");
      await expect(page).toHaveScreenshot(`${theme}/design-system.png`, { fullPage: true });
    });
  });
}
