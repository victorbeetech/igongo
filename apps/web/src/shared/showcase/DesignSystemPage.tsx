"use client";
// The design system showcase: every token and every shared component on one
// page, for review, at /design-system. It uses only the tokens and the shared
// components, so it always shows exactly what the portal pages use. The theme
// chips switch light and dark mode for the whole portal.

import Link from "next/link";
import { Suspense } from "react";
import { DialogHost } from "@/shared/dialogs/DialogHost";
import { setPreferences, usePreferences } from "@/shared/preferences/usePreferences";
import { Logo } from "@/shared/ui/logo/Logo";
import { BrandSection } from "./sections/BrandSection";
import { ButtonSection } from "./sections/ButtonSection";
import { CardSection } from "./sections/CardSection";
import { ChipSection } from "./sections/ChipSection";
import { ColourSection } from "./sections/ColourSection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { FieldSection } from "./sections/FieldSection";
import { IllustrationSection } from "./sections/IllustrationSection";
import { TypeSection } from "./sections/TypeSection";

/** The whole showcase page. */
export function DesignSystemPage() {
  const prefs = usePreferences();
  return (
    <>
      {/* Step 1: the red bar with the logo, the title and the theme switch. */}
      <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center gap-3 bg-primary px-4 py-2 text-on-primary">
        <Link href="/home" aria-label="Back to the portal"><Logo onRed height={32} /></Link>
        <h1 className="text-title font-bold">Design system</h1>
        <div className="ml-auto flex gap-1" role="group" aria-label="Theme">
          {(["light", "dark", "system"] as const).map((t) => (
            <button key={t} type="button" aria-pressed={prefs.theme === t} onClick={() => setPreferences({ theme: t })}
              className={`min-h-11 rounded-md px-3 text-label capitalize ${prefs.theme === t ? "bg-on-primary text-primary font-bold" : "hover:bg-primary-dark"}`}>
              {t}
            </button>
          ))}
        </div>
      </header>
      {/* Step 2: every section, top to bottom. */}
      <main className="mx-auto grid max-w-5xl gap-6 pb-16">
        <BrandSection />
        <ColourSection />
        <TypeSection />
        <ButtonSection />
        <FieldSection />
        <ChipSection />
        <CardSection />
        <FeedbackSection />
        <IllustrationSection />
      </main>
      {/* Step 3: the sample dialogs open over the page, as on every portal page. */}
      <Suspense>
        <DialogHost />
      </Suspense>
    </>
  );
}
