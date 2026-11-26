"use client";
// Sends the portal where the server's access rules say (the API decides; this
// only follows):
// - `two_factor_required`: the super admin must turn on 2-step first;
// - `staff_only` or `session_expired`: back to sign-in with the reason.
// Pages before sign-in never use it.

import { useEffect } from "react";
import { ApiError } from "@/shared/api/ApiError";
import { useAddress } from "@/shared/navigation/useAddress";
import { useMe } from "./useMe";

/** Follows the server's answer about the signed-in person. */
export function useAccessGuard() {
  const me = useMe();
  const { path, push } = useAddress();
  const code = me.error instanceof ApiError ? me.error.code : null;
  useEffect(() => {
    if (code === "two_factor_required" && path !== "/link-sign-in-methods") push("/link-sign-in-methods");
    if (code === "staff_only" || code === "session_expired") push(`/sign-in?error=${code}`);
    // `push` changes identity on each render; the code and path decide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, path]);
}
