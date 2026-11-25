// One titled block of the design system showcase, such as "Buttons".

import type { ReactNode } from "react";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** A section header and its examples. */
export function ShowcaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <SectionHeader title={title} />
      <div className="grid gap-3 px-4">{children}</div>
    </section>
  );
}
