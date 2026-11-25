"use client";
// The portal's side menu: the modules the role can open, built from the role
// at run time, never hard-coded. The super admin sees every module, so a long
// menu gets a search box at the top that filters it as the person types.

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { RoleSpec } from "@/shared/catalog/types";
import { moduleMatches } from "@/shared/navigation/moduleMatches";
import { moduleIcon } from "@/shared/ui/icons/moduleIcons";

/** A menu longer than this gets the search box. */
const SEARCH_FROM = 8;

/** The modules [role] reaches, with the current one ([activeCode]) highlighted. */
export function PortalSidebar({ role, activeCode }: { role: RoleSpec; activeCode: string }) {
  const [query, setQuery] = useState("");
  // Step 1: the module codes behind the role's tiles, or every module for the super admin.
  const reach = new Set(role.tiles.map(([, id]) => id!.slice(1, 3)));
  const modules = catalog.modules.filter((m) => m.code !== "00" && (role.key === "super-admin" || reach.has(m.code)));
  // Step 2: only the modules that match the search (all of them when it is empty).
  const shown = modules.filter((m) => moduleMatches(m, query));
  return (
    <nav aria-label="Modules" className="grid gap-0.5 p-2">
      {/* Step 3: the search box, kept in view at the top while the menu scrolls. */}
      {modules.length > SEARCH_FROM && (
        <label className="sticky top-0 z-10 mb-1 flex ring-4 ring-surface min-h-11 items-center gap-2 rounded-md border border-outline bg-surface-alt px-3 focus-within:border-primary-text">
          <Search size={16} aria-hidden className="text-muted" />
          <span className="sr-only">Search the menu</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${modules.length} modules`}
            className="w-full bg-transparent text-label outline-none placeholder:text-muted" />
        </label>
      )}
      {/* Step 4: one link per module, to its first web page. */}
      {shown.map((m) => {
        const Icon = moduleIcon(m.code);
        const entry = m.screens.find((s) => s.surfaces.includes("web")) ?? m.screens[0]!;
        const active = m.code === activeCode;
        return (
          <Link key={m.code} href={catalog.hrefOf(entry)} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-label ${active ? "bg-primary-container font-bold text-on-primary-container" : "hover:bg-surface-alt"}`}>
            <Icon size={16} aria-hidden />
            <span className="truncate">{m.name}</span>
          </Link>
        );
      })}
      {/* Step 5: say so when nothing matches, instead of an empty menu. */}
      {shown.length === 0 && <p role="status" className="px-3 py-2 text-label text-muted">No module matches &ldquo;{query}&rdquo;.</p>}
    </nav>
  );
}
