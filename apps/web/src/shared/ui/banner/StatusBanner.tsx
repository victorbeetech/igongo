// A full-width strip under the top bar: offline, client view or a tip.

import Link from "next/link";
import { CloudOff, Eye, Info } from "lucide-react";

/** Which banner to show. */
export type BannerTone = "offline" | "clientView" | "info";

// Colour and icon for each tone.
const TONES = {
  offline: { cls: "bg-warning/14", Icon: CloudOff, icon: "text-warning" },
  clientView: { cls: "bg-info/14", Icon: Eye, icon: "text-info" },
  info: { cls: "bg-info/14", Icon: Info, icon: "text-info" },
};

/** A one-line banner with an icon, a message and an optional link. */
export function StatusBanner({ tone, message, action, href }: { tone: BannerTone; message: string; action?: string; href?: string }) {
  const { cls, Icon, icon } = TONES[tone];
  return (
    <div role="status" className={`flex items-center gap-2 px-4 py-1.5 text-label ${cls}`}>
      <Icon size={16} className={icon} aria-hidden />
      <span className="flex-1">{message}</span>
      {action && href && (
        <Link className="font-bold text-primary-text underline" href={href}>
          {action}
        </Link>
      )}
    </div>
  );
}
