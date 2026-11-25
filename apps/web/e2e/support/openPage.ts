// Opens one portal page in the static preview with chosen preferences, and
// waits until it has drawn. Shared by the browser checks.

import type { Page } from "@playwright/test";

/** The preferences a check can set (see src/shared/preferences/preferences.ts). */
export interface PagePrefs {
  theme?: "light" | "dark";
  state?: string;
  role?: string;
}

/** Saves [prefs] (and a cookie choice, so the banner stays away) before the page loads. */
export async function usePrefs(page: Page, prefs: PagePrefs): Promise<void> {
  await page.addInitScript((p) => {
    localStorage.setItem("igongo.preferences", JSON.stringify({ theme: "light", textSize: "standard", role: "super-admin", state: "normal", ...p }));
    localStorage.setItem("igongo.consent", "denied");
  }, prefs);
}

/** Goes to [path] (such as "/staff/sample") and waits for its heading. */
export async function openPage(page: Page, path: string): Promise<void> {
  // A change of `#` only redraws, so moving between pages is quick.
  if (page.url().includes("/index.html")) await page.evaluate((p) => (window.location.hash = p), path);
  else await page.goto(`/index.html#${path}`);
  await page.locator("main, [role=main], h1").first().waitFor();
  await page.waitForTimeout(150);
}
