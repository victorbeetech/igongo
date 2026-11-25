// The one list row used in every list: avatar or icon, title, subtitle, an
// optional status and a chevron when it links somewhere.

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { InitialsAvatar } from "../avatar/InitialsAvatar";
import { StatusChip } from "../chip/StatusChip";

interface ListRowProps {
  /** The main words. */
  title: string;
  /** A second line. */
  subtitle?: string;
  /** A status word shown as a chip. */
  status?: string;
  /** An icon in place of the initials avatar. */
  leading?: ReactNode;
  /** Where the row goes. */
  href?: string;
}

/** One row of a list. */
export function ListRow({ title, subtitle, status, leading, href }: ListRowProps) {
  const body = (
    <>
      <span className="text-muted">{leading ?? <InitialsAvatar name={title} />}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-subtitle font-bold">{title}</span>
        {subtitle && <span className="block truncate text-caption text-muted">{subtitle}</span>}
      </span>
      {status && <StatusChip status={status} />}
      {href && <ChevronRight aria-hidden size={18} className="text-muted" />}
    </>
  );
  // Rows are at least 56 pixels tall, a comfortable tap target.
  const cls = "flex min-h-14 items-center gap-3 border-b border-line px-4 py-2 last:border-b-0";
  return href ? (
    <Link href={href} className={`${cls} hover:bg-surface-alt`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
