"use client";
// The portal's sidebar, in the style of ChatGPT and Claude: open by default,
// with its own fold button at the top (never outside it). Open, it shows the
// role, the search box and the module list; folded, it becomes a narrow rail
// of icons with the open button, a search button and one icon per module.
// The modules come from the role at run time: signed in, from the layout the
// super admin published for the person's roles; otherwise the preview role.
// On small screens it is a drawer, opened from the top bar, always open wide.
// There is one fold button (the panel icon) in every size, and no role
// switcher: one account is one kind. Preview sits at the foot of the
// sidebar, for the super admin only.

import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/modules/m04-users-login/data/authApi";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { RoleSpec } from "@/shared/catalog/types";
import { useMe } from "@/shared/session/useMe";
import { showToast } from "@/shared/ui/toast/toast";
import { layoutModules, useMyLayout } from "@/shared/session/useMyLayout";
import { SidebarModules } from "./SidebarModules";
import { SidebarSearch } from "./SidebarSearch";
import { useSidebarOpen } from "./useSidebarOpen";

interface PortalSidebarProps {
  /** The role whose modules show. */
  role: RoleSpec;
  /** The module of the page showing, highlighted. */
  activeCode: string;
  /** Small screens: whether the drawer is open, and how to close it. */
  drawerOpen: boolean;
  onCloseDrawer: () => void;
  /** Opens the preview panel (super admin only). */
  onPreview: () => void;
}

// The square icon buttons of the sidebar (fold, open, search, close).
const ICON_BUTTON =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-alt hover:text-ink";

/** The sidebar for [role]. */
export function PortalSidebar({
  role,
  activeCode,
  drawerOpen,
  onCloseDrawer,
  onPreview,
}: PortalSidebarProps) {
  const [open, setOpen] = useSidebarOpen();
  const [searching, setSearching] = useState(false);
  const [focusSignal, setFocusSignal] = useState(0);
  // Step 1: the module codes behind the role's tiles, or every module for the super admin.
  const layout = useMyLayout().data;
  // The signed-in person's own role name, else the previewed role's.
  const me = useMe().data;
  const roleName = me?.access.roles[0]?.name ?? role.name;
  const canPreview = !!me?.access.roles.some((r) => r.key === "super-admin");
  const router = useRouter();
  // Signs out on the server, then opens the sign-in page; a failure is shown, never hidden.
  const endSession = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (e) {
      showToast(
        e instanceof Error
          ? e.message
          : "Could not sign out. Please try again.",
      );
    }
  };
  const reach = new Set(role.tiles.map(([, id]) => id!.slice(1, 3)));
  const all = catalog.modules.filter((m) => m.code !== "00");
  const modules = layout
    ? layoutModules(layout, all)
    : all.filter((m) => role.key === "super-admin" || reach.has(m.code));
  // Step 2: folded only on wide screens; the small-screen drawer is always wide.
  const folded = !open && !drawerOpen;
  const openAndSearch = () => {
    setOpen(true);
    setFocusSignal((n) => n + 1);
  };

  return (
    <aside
      aria-label="Sidebar"
      className={`${drawerOpen ? "flex" : "hidden"} fixed inset-y-14 left-0 z-20 w-72 flex-col border-r border-line bg-surface shadow-xl lg:sticky lg:top-14 lg:flex lg:h-[calc(100dvh-3.5rem)] lg:shadow-none ${folded ? "lg:w-16" : "lg:w-72"} transition-[width] duration-200 motion-reduce:transition-none`}
    >
      {/* Step 3: the top row: the role and the fold button, or just the open button when folded. */}
      <div
        className={`flex items-center gap-1 p-2 ${folded ? "flex-col" : ""}`}
      >
        {folded ? (
          <>
            <button
              type="button"
              className={ICON_BUTTON}
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
            <button
              type="button"
              className={ICON_BUTTON}
              onClick={openAndSearch}
              aria-label="Search"
              title="Search (Ctrl K)"
            >
              <Search size={20} />
            </button>
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1 truncate px-2 text-caption font-bold tracking-widest text-muted uppercase">
              {roleName}
            </span>
            {/* The one fold button: wide screens fold to icons, the small-screen drawer closes. */}
            <button
              type="button"
              className={ICON_BUTTON}
              onClick={() => (drawerOpen ? onCloseDrawer() : setOpen(false))}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        )}
      </div>
      {/* Step 4: the search box (open only), then the modules, scrolling under the fixed top. */}
      {!folded && (
        <div className="px-2 pb-2">
          <SidebarSearch
            modules={modules}
            onQuery={setSearching}
            focusSignal={focusSignal}
          />
        </div>
      )}
      <nav
        aria-label="Modules"
        className={`min-h-0 flex-1 overflow-y-auto px-2 pb-4 ${searching && !folded ? "hidden" : ""}`}
      >
        <SidebarModules
          modules={modules}
          activeCode={activeCode}
          folded={folded}
        />
      </nav>
      {/* Step 5: Preview, for the super admin only (above sign out). */}
      {canPreview && (
        <div className="border-t border-line p-2">
          <button
            type="button"
            onClick={onPreview}
            title="Preview"
            aria-label="Preview"
            className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-label text-muted hover:bg-surface-alt hover:text-ink ${folded ? "justify-center px-0" : ""}`}
          >
            <SlidersHorizontal size={18} aria-hidden />
            {!folded && <span>Preview</span>}
          </button>
        </div>
      )}
      {/* Step 6: sign out, for everyone who is signed in; at the very foot. */}
      {me && (
        <div className="border-t border-line p-2">
          <button
            type="button"
            onClick={() => void endSession()}
            title="Sign out"
            aria-label="Sign out"
            className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-label text-muted hover:bg-surface-alt hover:text-ink ${folded ? "justify-center px-0" : ""}`}
          >
            <LogOut size={18} aria-hidden />
            {!folded && <span>Sign out</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
