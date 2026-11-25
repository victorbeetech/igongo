// The portal search: finds modules, every page (screen) and every pop-up
// (dialog) the role can reach, by name, purpose or module, so things deep
// inside a module are one search away. Whole-word starts rank first.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ModuleSpec } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import type { SearchHit } from "./searchHit";

/** How well [text] matches [q]: 3 starts the text, 2 starts a word, 1 anywhere, 0 no match. */
function score(text: string, q: string): number {
  const t = text.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(` ${q}`)) return 2;
  return t.includes(q) ? 1 : 0;
}

/** Up to [limit] results for [query] across [modules], best first. */
export function searchCatalog(modules: ModuleSpec[], query: string, limit = 40): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: (SearchHit & { rank: number })[] = [];
  for (const m of modules) {
    // Step 1: the module itself, by its name.
    const entry = m.screens.find((s) => s.surfaces.includes("web")) ?? m.screens[0]!;
    const ms = score(m.name, q);
    if (ms) hits.push({ kind: "module", title: m.name, context: `${m.screens.length} pages`, href: catalog.hrefOf(entry), moduleCode: m.code, rank: ms + 3 });
    // Step 2: every page, by its name (best) or its purpose.
    for (const s of m.screens) {
      const r = Math.max(score(s.name, q) * 2, score(s.purpose, q));
      if (r) hits.push({ kind: "page", title: s.name, context: m.name, href: catalog.hrefOf(s), moduleCode: m.code, rank: r });
    }
    // Step 3: every pop-up, opened over the page that shows it.
    for (const d of m.dialogs) {
      const r = Math.max(score(d.name, q) * 2, score(d.purpose, q));
      if (!r) continue;
      const host = m.screens.find((s) => s.dialogs.includes(d.id)) ?? entry;
      hits.push({ kind: "popup", title: d.name, context: `${m.name} · ${host.name}`, href: hrefFor(d.id, catalog.hrefOf(host)), moduleCode: m.code, rank: r - 0.5 });
    }
  }
  // Step 4: best first; ties keep the inventory order.
  return hits
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map((h) => ({ kind: h.kind, title: h.title, context: h.context, href: h.href, moduleCode: h.moduleCode }));
}
