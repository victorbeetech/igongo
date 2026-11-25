// Record screens have `:id` in their route, such as
// `/users-login/account-detail/:id`. These helpers fill it in and read it back.

import type { ScreenSpec } from "@/shared/catalog/types";

/** The address of [screen] for record [id]. */
export function recordHref(screen: ScreenSpec, id: string): string {
  return screen.route.replace(":id", encodeURIComponent(id));
}

/** The record ID at the end of [path], or "" for the sample record. */
export function recordIdOf(path: string): string {
  const last = decodeURIComponent(path.split("/").pop() ?? "");
  return last === "sample" ? "" : last;
}
