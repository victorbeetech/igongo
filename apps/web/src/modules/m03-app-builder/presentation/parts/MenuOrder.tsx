"use client";
// The menu part of the layout editor (S03-01, S03-04): every module with
// up and down buttons and a show or hide switch. Modules the role cannot
// open never show to its holders, whatever their place here.

import { ArrowDown, ArrowUp } from "lucide-react";
import { catalog } from "@/shared/catalog/catalogIndex";
import { moduleIcon } from "@/shared/ui/icons/moduleIcons";

interface MenuOrderProps {
  /** Module keys in order (the whole list). */
  order: string[];
  hidden: string[];
  onChange: (order: string[], hidden: string[]) => void;
}

export function MenuOrder({ order, hidden, onChange }: MenuOrderProps) {
  const name = (slug: string) => catalog.modules.find((m) => m.slug === slug);
  /** Swaps item [i] with its neighbour [by] places away. */
  const move = (i: number, by: number) => {
    const next = [...order];
    const j = i + by;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j] as string, next[i] as string];
    onChange(next, hidden);
  };
  const toggle = (slug: string) => onChange(order, hidden.includes(slug) ? hidden.filter((k) => k !== slug) : [...hidden, slug]);
  return (
    <ol className="grid gap-1" aria-label="Menu order">
      {order.map((slug, i) => {
        const m = name(slug);
        const Icon = moduleIcon(m?.code ?? "");
        const off = hidden.includes(slug);
        return (
          <li key={slug} className={`flex min-h-10 items-center gap-2 rounded-md border border-line px-2 ${off ? "text-muted" : ""}`}>
            <Icon size={16} aria-hidden />
            <span className="flex-1 truncate text-label">{m?.name ?? slug}</span>
            <button type="button" className="rounded-md px-2 text-caption hover:bg-surface-alt" onClick={() => toggle(slug)}>{off ? "Show" : "Hide"}</button>
            <button type="button" aria-label={`Move ${m?.name ?? slug} up`} className="rounded-md p-1 hover:bg-surface-alt" onClick={() => move(i, -1)}><ArrowUp size={16} /></button>
            <button type="button" aria-label={`Move ${m?.name ?? slug} down`} className="rounded-md p-1 hover:bg-surface-alt" onClick={() => move(i, 1)}><ArrowDown size={16} /></button>
          </li>
        );
      })}
    </ol>
  );
}
