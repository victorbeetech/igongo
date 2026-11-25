"use client";
// The signed-in person: their account and what their roles let them do.
// Every connected page reads this; it is cached and shared.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";

/** What one permission reaches. */
export interface GrantedPermission {
  key: string;
  scope: string;
}

/** The signed-in person, from `GET /api/users/me`. */
export interface Me {
  account: { id: string; name: string; email: string; kind: "staff" | "client"; status: string; twoFactorEnabled: boolean; providers: string[] };
  access: { roles: { id: string; key: string; name: string }[]; permissions: GrantedPermission[]; menu: string[]; homeTiles: string[]; isStaff: boolean };
}

/** The query key, so sign-in and sign-out can refresh it. */
export const ME_KEY = ["me"];

/** The signed-in person; the query fails with 401 when nobody is signed in. */
export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: () => api<Me>("/api/users/me") });
}

/** True when [granted] covers [required] (same rules as the API: `*` in any part). */
export function can(me: Me | undefined, required: string): boolean {
  const need = required.split(".");
  return !!me?.access.permissions.some(({ key }) => key === "*" || key.split(".").every((part, i) => part === "*" || part === need[i]));
}
