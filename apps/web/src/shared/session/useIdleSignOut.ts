"use client";
// Signs the web portal out after the super admin's "no activity" minutes,
// for the shared gate and reception computers. Any click, key, scroll or
// touch counts as activity. The server also ends staff web sessions after
// their maximum hours, whatever happens here.

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { signOut } from "@/modules/m04-users-login/data/authApi";
import { useMySecuritySettings } from "@/modules/m04-users-login/data/securityApi";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { showToast } from "@/shared/ui/toast/toast";
import { useMe } from "./useMe";

const ACTIVITY = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

/** Starts the idle timer while someone is signed in. */
export function useIdleSignOut() {
  const me = useMe();
  const settings = useMySecuritySettings();
  const client = useQueryClient();
  const minutes = me.data ? settings.data?.webIdleMinutes : undefined;

  useEffect(() => {
    if (!minutes) return;
    let timer = 0;
    // Step 1: on time-out, sign out on the server, forget everything cached, go to sign-in.
    // If the server cannot be reached, this computer still forgets the session, and the
    // server ends it by its own time limit; the person is told.
    const expire = () =>
      void signOut()
        .catch(() => showToast("Signed out on this computer. Igongo could not be reached; the session also ends on its own."))
        .finally(() => {
          client.clear();
          window.location.assign(absoluteUrl("/sign-in?reason=idle"));
        });
    // Step 2: any activity starts the count again.
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(expire, minutes * 60_000);
    };
    restart();
    ACTIVITY.forEach((e) => window.addEventListener(e, restart, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      ACTIVITY.forEach((e) => window.removeEventListener(e, restart));
    };
  }, [minutes, client]);
}
