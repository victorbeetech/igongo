"use client";
// The search box at the top of the sidebar, and its results. It finds
// modules, every page and every pop-up the role can reach (see
// searchCatalog), so deep pages are one search away. Ctrl+K (Cmd+K on a Mac)
// jumps to it from anywhere; arrow keys move through the results.

import { AppWindow, LayoutGrid, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ModuleSpec } from "@/shared/catalog/types";
import { searchCatalog } from "@/shared/search/searchCatalog";
import type { SearchHitKind } from "@/shared/search/searchHit";
import { moduleIcon } from "@/shared/ui/icons/moduleIcons";

// The small label under each result, by kind.
const KIND_LABEL: Record<SearchHitKind, string> = { module: "Module", page: "Page", popup: "Pop-up" };

/** The search box; [onQuery] tells the sidebar whether results are showing. */
export function SidebarSearch({ modules, onQuery, focusSignal }: { modules: ModuleSpec[]; onQuery: (searching: boolean) => void; focusSignal: number }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const hits = useMemo(() => searchCatalog(modules, query), [modules, query]);

  // Step 1: Ctrl+K or Cmd+K focuses the box; so does the folded sidebar's search icon.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (focusSignal) input.current?.focus();
  }, [focusSignal]);

  // Step 2: typing updates the results and tells the sidebar to hide the module list.
  const change = (value: string) => {
    setQuery(value);
    onQuery(value.trim() !== "");
  };
  const clear = () => change("");
  // Step 3: arrow down from the box goes into the results; Escape clears.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") clear();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list.current?.querySelector("a")?.focus();
    }
  };
  // Arrow keys move between results.
  const onListKey = (e: React.KeyboardEvent) => {
    const links = [...(list.current?.querySelectorAll("a") ?? [])];
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") links[i + 1]?.focus();
    else if (e.key === "ArrowUp") (i > 0 ? links[i - 1] : input.current)?.focus();
    else if (e.key === "Escape") input.current?.focus();
    else return;
    e.preventDefault();
  };

  return (
    <div className="grid gap-1">
      {/* The box: full width of the sidebar, with a clear button once something is typed. */}
      <label className="flex min-h-11 items-center gap-2 rounded-md border border-outline bg-surface-alt px-3 focus-within:border-primary-text">
        <Search size={16} aria-hidden className="shrink-0 text-muted" />
        <span className="sr-only">Search pages, pop-ups and modules</span>
        <input ref={input} type="search" value={query} onChange={(e) => change(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Search everything" aria-controls="sidebar-results" autoComplete="off"
          className="w-full min-w-0 bg-transparent text-label outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
        {query ? (
          <button type="button" onClick={clear} aria-label="Clear search" className="-mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-surface"><X size={16} /></button>
        ) : (
          <kbd className="hidden shrink-0 rounded-sm border border-line px-1 text-caption text-muted lg:inline">Ctrl K</kbd>
        )}
      </label>
      {/* The results: icon, name, where it lives and its kind. */}
      {query.trim() && (
        <div id="sidebar-results" role="region" aria-label="Search results">
          <p role="status" className="px-1 py-1 text-caption text-muted">
            {hits.length ? `${hits.length}${hits.length === 40 ? "+" : ""} results` : `Nothing matches “${query.trim()}”.`}
          </p>
          <ul ref={list} onKeyDown={onListKey} className="grid gap-0.5">
            {hits.map((h) => {
              const Icon = h.kind === "module" ? LayoutGrid : h.kind === "popup" ? AppWindow : moduleIcon(h.moduleCode);
              return (
                <li key={`${h.kind}-${h.href}-${h.title}`}>
                  <Link href={h.href} onClick={clear} className="flex min-h-11 items-start gap-2 rounded-md px-2 py-1.5 hover:bg-surface-alt focus:bg-surface-alt">
                    <Icon size={16} aria-hidden className="mt-0.5 shrink-0 text-muted" />
                    <span className="grid min-w-0">
                      <span className="truncate text-label font-bold">{h.title}</span>
                      <span className="truncate text-caption text-muted">{KIND_LABEL[h.kind]} · {h.context}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
