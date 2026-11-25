// S00-05 Sign in on the web: one entry point for everyone. Email first, then
// the other methods the super admin has switched on, and guest sign-up.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";
import { Field } from "@/shared/ui/field/Field";
import { SIGN_IN_METHODS } from "./signInMethods";

/** The sign-in page. */
export function SignInPage({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  return (
    <div className="grid gap-3 p-4">
      <p className="text-caption text-muted">Staff, riders and guests all sign in here.</p>
      {/* Email, then the password page. */}
      <Field label="Email" hint="name@example.com" type="email" />
      <Button href={hrefFor("S00-12", here)} block>Continue</Button>
      <div className="flex items-center gap-2 text-caption text-muted"><hr className="flex-1 border-line" />or<hr className="flex-1 border-line" /></div>
      {/* The other methods, each its own page. */}
      {SIGN_IN_METHODS.map((m) => <Button key={m.screenId} variant="secondary" href={hrefFor(m.screenId, here)} block>{m.label}</Button>)}
      {/* Guest sign-up, and the locked account case for review. */}
      <Button variant="text" href={hrefFor("S00-18", here)}>New guest? Create an account</Button>
      <Button variant="text" href={hrefFor("S00-20", here)}>Prototype: show a locked account</Button>
    </div>
  );
}
