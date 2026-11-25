// The frame for the sign-in pages: the stacked logo above a centred card.

import type { ReactNode } from "react";
import { Logo } from "@/shared/ui/logo/Logo";

/** A centred card with the logo, for pages before sign-in. */
export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo shape="stacked" height={120} />
        </div>
        <div className="rounded-lg border border-line bg-surface">
          <h1 className="px-4 pt-4 text-headline font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
