// The one card used on every page: a bordered surface with padding.

import type { ReactNode } from "react";

/** A bordered surface for grouping content. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-line bg-surface p-3 ${className}`}>{children}</div>;
}
