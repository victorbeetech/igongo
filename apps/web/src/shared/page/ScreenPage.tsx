"use client";
// Draws one page: finds its screen, builds its ScreenContext, picks the
// hand-made page or the shared layout, applies the previewed state, and puts
// it in the right frame (portal, sign-in or public). Every route uses it.

import { Suspense } from "react";
import { allOverrides } from "@/app/catalog/overrides.g";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { DialogHost } from "@/shared/dialogs/DialogHost";
import { AuthShell } from "@/shared/layout/AuthShell";
import { PortalShell } from "@/shared/layout/PortalShell";
import { PublicShell } from "@/shared/layout/PublicShell";
import { usePreferences } from "@/shared/preferences/usePreferences";
import { AppOnlyLayout } from "@/shared/screens/platform/AppOnlyLayout";
import { ScreenLayout } from "@/shared/screens/ScreenLayout";
import { StateView } from "@/shared/states/StateView";
import { frameOf } from "./surfaceOf";

/** The page for screen number [id]. */
export function ScreenPage({ id }: { id: string }) {
  // Step 1: everything the layouts need.
  const prefs = usePreferences();
  const spec = catalog.screen(id)!;
  const role = catalog.role(prefs.role);
  const screen: ScreenContext = { spec, module: catalog.module(id.slice(1, 3)), state: prefs.state, role, links: spec.opens.filter((o) => o !== "home") };
  const frame = frameOf(spec);

  // Step 2: the content: app-only notice, the previewed state, a hand-made page or the shared layout.
  const override = allOverrides[spec.id];
  let body;
  if (frame === "appOnly") body = <AppOnlyLayout screen={screen} />;
  else if (prefs.state !== "normal" && prefs.state !== "offline") body = <StateView state={prefs.state} name={spec.name} />;
  else body = override ? override(screen) : <ScreenLayout screen={screen} />;

  // Step 3: the dialog named in the address, if any, over the page.
  const content = (
    <>
      {body}
      <Suspense>
        <DialogHost />
      </Suspense>
    </>
  );

  // Step 4: the frame.
  if (frame === "auth") return <AuthShell title={spec.name}>{content}</AuthShell>;
  if (frame === "public") return <PublicShell>{content}</PublicShell>;
  return <PortalShell spec={spec} role={role} offline={prefs.state === "offline"}>{content}</PortalShell>;
}
