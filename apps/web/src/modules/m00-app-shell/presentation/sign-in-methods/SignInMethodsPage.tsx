"use client";
// S00-09 Sign-in and 2-step: the signed-in person's own sign-in security.
// The super admin (and sensitive roles when the switch is on) is sent here
// by the portal until 2-step is on. Three parts, top to bottom:
//   1. a password, for accounts made with Google or Apple (needed for 2-step);
//   2. 2-step with an authenticator app, and recovery codes;
//   3. the linked sign-in methods (Google, Apple, password).

import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { useMe } from "@/shared/session/useMe";
import { Button } from "@/shared/ui/button/Button";
import { LinkedMethodsSection } from "./LinkedMethodsSection";
import { FirstPasswordSection } from "./FirstPasswordSection";
import { TwoStepSection } from "./TwoStepSection";

/** The sign-in security page. */
export function SignInMethodsPage({ screen }: { screen: ScreenContext }) {
  const me = useMe();
  return (
    <LiveData query={me} name={screen.spec.name}>
      {(d) => {
        const hasPassword = d.account.providers.includes("credential");
        return (
          <div className="grid gap-5 p-4 pt-2">
            <p className="text-caption text-muted">Signed in as {d.account.email}. Keep your account safe: a password, 2-step, and only the sign-in methods you use.</p>
            {!hasPassword && <FirstPasswordSection />}
            <TwoStepSection enabled={d.account.twoFactorEnabled} hasPassword={hasPassword} />
            <LinkedMethodsSection providers={d.account.providers} />
            {d.account.twoFactorEnabled && <Button href="/home" block>Continue to Igongo</Button>}
          </div>
        );
      }}
    </LiveData>
  );
}
