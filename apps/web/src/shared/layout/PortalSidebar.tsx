// The portal's side menu: the modules the role can open, built from the role
// at run time, never hard-coded. The super admin sees every module.

import Link from "next/link";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { RoleSpec } from "@/shared/catalog/types";
import { moduleIcon } from "@/shared/ui/icons/moduleIcons";

/** The modules [role] reaches, with the current one ([activeCode]) highlighted. */
export function PortalSidebar({ role, activeCode }: { role: RoleSpec; activeCode: string }) {
  // Step 1: the module codes behind the role's tiles, or every module for the super admin.
  const reach = new Set(role.tiles.map(([, id]) => id!.slice(1, 3)));
  const modules = catalog.modules.filter((m) => m.code !== "00" && (role.key === "super-admin" || reach.has(m.code)));
  // Step 2: one link per module, to its first web page.
  return (
    <nav aria-label="Modules" className="grid gap-0.5 p-2">
      {modules.map((m) => {
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
    </nav>
  );
}
