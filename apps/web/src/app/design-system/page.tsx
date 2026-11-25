// The design system showcase page, for review: every token and shared
// component on one page. Kept out of search results.

import type { Metadata } from "next";
import { DesignSystemPage } from "@/shared/showcase/DesignSystemPage";

/** A plain title, and no indexing: this page is for the team, not for guests. */
export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

/** The showcase. */
export default function Page() {
  return <DesignSystemPage />;
}
