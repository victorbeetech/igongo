"use client";
// The cookie consent banner. It asks once; analytics and ad tags load only
// after "Accept" (Data Protection and Privacy Act, and Google consent mode).

import { setConsent, useConsent } from "./consent";
import { Button } from "@/shared/ui/button/Button";

/** The consent banner at the bottom of the page, until the visitor answers. */
export function ConsentBanner() {
  if (useConsent() !== "unknown") return null;
  return (
    <div role="region" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface p-4 shadow-2xl">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
        <p className="min-w-60 flex-1 text-body">We use cookies to understand visits and improve bookings. You can say no and everything still works.</p>
        <Button variant="secondary" onClick={() => setConsent("denied")}>No, thanks</Button>
        <Button onClick={() => setConsent("granted")}>Accept</Button>
      </div>
    </div>
  );
}
