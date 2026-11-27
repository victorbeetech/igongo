// The frame for every Auth page (sign in, forgot password, check email): the
// hut photo on top with the Igongo logo and a red wave, then a white card
// that holds the page's own content. The same look as the phone app's Auth
// screens (apps/igongo/lib/shared/ui/auth), so both match.

import type { ReactNode } from "react";
import { Logo } from "@/shared/ui/logo/Logo";

/** The Auth frame: photo, logo and wave on top, then the card with the page content. */
export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-dvh justify-center bg-background">
      <div className="w-full max-w-md">
        {/* Step 1: the hut photo with the logo on it and a red wave along the bottom. */}
        <div className="relative h-56 overflow-hidden">
          {/* The hut photo the owner supplied (in public/images). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/auth-hut.jpg" alt="Igongo hotel hut" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-3 flex justify-center">
            <Logo shape="stacked" height={72} />
          </div>
          {/* Step 2: the red wave along the bottom edge of the photo. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-6 w-full fill-primary"
          >
            <path d="M0 14 Q100 40 200 22 T400 14 V40 H0 Z" />
          </svg>
        </div>
        {/* Step 3: the white card, pulled up over the photo, holding the page's content. */}
        <div className="-mt-4 mx-4 grid gap-3 rounded-lg border border-line bg-surface p-4">
          <h1 className="text-headline font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
