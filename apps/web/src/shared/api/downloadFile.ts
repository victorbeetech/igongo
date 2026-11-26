// Downloads a file the API makes (such as a CSV export) with the session
// cookie, then hands it to the browser as a saved file.

import { ApiError } from "./ApiError";
import { API_URL } from "./apiConfig";
import { showToast } from "@/shared/ui/toast/toast";

/**
 * Fetches [path] (such as `/api/payroll/runs/x/export.csv`) and saves it as [filename].
 * Shows a toast instead of throwing, because it runs from a button.
 */
export async function downloadFile(path: string, filename: string): Promise<void> {
  try {
    // Step 1: fetch with the session cookie, like every other call.
    const res = await fetch(`${API_URL}${path}`, { credentials: "include" });
    if (!res.ok) throw new ApiError(res.status, "error", res.status === 403 ? "You cannot download this." : "The download failed.");
    // Step 2: turn the reply into a link and click it.
    const url = URL.createObjectURL(await res.blob());
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    showToast(error instanceof ApiError ? error.message : "We couldn't reach Igongo. Check your connection and try again.");
  }
}
