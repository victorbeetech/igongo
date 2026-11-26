"use client";
// The signed-in person's layout from `GET /api/layout/me` (module 3): menu
// order, tabs, home tiles and the client view switch, combined from all
// their roles by the API. Signed out it fails with 401, and the portal
// falls back to the preview role from the catalog.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import type { ModuleSpec } from "@/shared/catalog/types";

/** One person's layout. */
export interface MyLayout {
  /** Module keys in menu order; `*` stands for every other module. */
  menu: string[];
  tabs: string[];
  tiles: string[];
  canSwitchToClient: boolean;
  markTestOrders: boolean;
}

/** The query key, so sign-in, sign-out and a publish can refresh it. */
export const MY_LAYOUT_KEY = ["layout", "me"];

export function useMyLayout() {
  return useQuery({ queryKey: MY_LAYOUT_KEY, queryFn: () => api<MyLayout>("/api/layout/me"), retry: false });
}

/** [modules] in the layout's menu, in its order (the rest by code when it holds `*`). */
export function layoutModules(layout: MyLayout, modules: ModuleSpec[]): ModuleSpec[] {
  const place = (m: ModuleSpec) => {
    const i = layout.menu.indexOf(m.slug);
    return i >= 0 ? i : layout.menu.includes("*") ? layout.menu.length : -1;
  };
  return modules.filter((m) => place(m) >= 0).sort((a, b) => place(a) - place(b) || a.code.localeCompare(b.code));
}
