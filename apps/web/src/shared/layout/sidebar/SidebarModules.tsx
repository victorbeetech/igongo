// The module list of the sidebar: icon and name when open, icon only (with
// its name as a tooltip and for screen readers) when folded.

import Link from "next/link";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ModuleSpec } from "@/shared/catalog/types";
import { moduleIcon } from "@/shared/ui/icons/moduleIcons";

/** One link per module, to its first web page; [activeCode] is highlighted. */
export function SidebarModules({ modules, activeCode, folded }: { modules: ModuleSpec[]; activeCode: string; folded: boolean }) {
  return (
    <ul className="grid gap-0.5">
      {modules.map((m) => {
        const Icon = moduleIcon(m.code);
        const entry = m.screens.find((s) => s.surfaces.includes("web")) ?? m.screens[0]!;
        const active = m.code === activeCode;
        return (
          <li key={m.code}>
            <Link href={catalog.hrefOf(entry)} aria-current={active ? "page" : undefined} title={folded ? m.name : undefined} aria-label={folded ? m.name : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-md text-label ${folded ? "justify-center" : "px-3"} ${active ? "bg-primary-container font-bold text-on-primary-container" : "hover:bg-surface-alt"}`}>
              <Icon size={folded ? 18 : 16} aria-hidden className="shrink-0" />
              {!folded && <span className="truncate">{m.name}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
