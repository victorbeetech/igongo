"use client";
// The web portal frame: the red top bar with the logo, title, search and
// alerts; the role's module menu at the side (with Preview at its foot, for
// the super admin only); banners; then the page. It also follows the
// server's access rules (2-step first, staff only) and signs out shared
// computers after the super admin's idle minutes.

import Link from "next/link";
import { Bell, Menu, Search, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { RoleSpec, ScreenSpec } from "@/shared/catalog/types";
import { PreviewPanel } from "@/shared/preview/PreviewPanel";
import { useAccessGuard } from "@/shared/session/useAccessGuard";
import { useIdleSignOut } from "@/shared/session/useIdleSignOut";
import { StatusBanner } from "@/shared/ui/banner/StatusBanner";
import { Logo } from "@/shared/ui/logo/Logo";
import { PortalSidebar } from "./sidebar/PortalSidebar";

interface PortalShellProps {
  /** The page inside the frame. */
  spec: ScreenSpec;
  /** The role whose menu shows. */
  role: RoleSpec;
  /** Whether the preview says the network is lost. */
  offline: boolean;
  /** The page content. */
  children: ReactNode;
}

/** The portal frame around one page. */
export function PortalShell({ spec, role, offline, children }: PortalShellProps) {
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState(false);
  useAccessGuard();
  useIdleSignOut();
  // Icon links in the red bar; white on Igongo red keeps strong contrast in both modes.
  const barLink = "inline-flex size-11 items-center justify-center rounded-md hover:bg-primary-dark";
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Step 1: the red top bar, the same in light and dark mode. */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-primary px-2 text-on-primary sm:px-4">
        <button type="button" className={`${barLink} lg:hidden`} aria-label="Menu" onClick={() => setMenu(!menu)}><Menu size={20} /></button>
        <Link href="/home" className="flex items-center gap-2" aria-label="Igongo home">
          <Logo height={32} onRed />
          <span className="hidden font-brand text-title font-bold tracking-wide sm:inline">IGONGO</span>
        </Link>
        <h1 className="ml-2 min-w-0 flex-1 truncate text-subtitle font-bold">{spec.name}</h1>
        <Link className={barLink} href="/global-search" aria-label="Search"><Search size={20} /></Link>
        <Link className={barLink} href="/notification-inbox" aria-label="Alerts"><Bell size={20} /></Link>
        <Link className={barLink} href="/my-profile/sample" aria-label="My profile"><UserRound size={20} /></Link>
      </header>
      <div className="flex flex-1">
        {/* Step 2: the sidebar: the role's modules and the search; a drawer on small screens. */}
        <PortalSidebar role={role} activeCode={spec.id.slice(1, 3)} drawerOpen={menu} onCloseDrawer={() => setMenu(false)} onPreview={() => setPreview(true)} />
        {/* Step 3: the banners and the page. */}
        <main className="min-w-0 flex-1 pb-12">
          {offline && <StatusBanner tone="offline" message="You're offline. Saved items show; new ones sync later." action="Sync status" href="/sync-status" />}
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      {preview && <PreviewPanel onClose={() => setPreview(false)} />}
    </div>
  );
}
