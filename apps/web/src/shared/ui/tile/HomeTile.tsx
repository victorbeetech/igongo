// A tile on a home page: an icon, a label and an optional count badge.

import Link from "next/link";
import type { ReactNode } from "react";

/** One home tile linking to [href]. */
export function HomeTile({ label, icon, count, href }: { label: string; icon: ReactNode; count?: string; href: string }) {
  return (
    <Link href={href} className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3 hover:border-primary">
      <span className="flex items-center">
        {/* The icon in a soft red square. */}
        <span className="rounded-sm bg-primary-container p-2 text-on-primary-container">{icon}</span>
        {count && <span className="ml-auto rounded-full bg-primary px-2 text-caption font-bold text-on-primary">{count}</span>}
      </span>
      <span className="line-clamp-3 text-label font-bold">{label}</span>
    </Link>
  );
}
