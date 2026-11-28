// One block of the guest home editor: its on/off switch, its list of items with
// Add and Remove, and each item's own switch and fields. Used for stories, slides
// and quick actions, so all three behave the same way.

import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button/Button";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** Props for one block; T is the item type, which always has an on/off flag. */
interface HomeBlockProps<T extends { enabled: boolean }> {
  /** The block's name, such as "Happening today (stories)". */
  title: string;
  /** Whether the whole block shows in the app. */
  enabled: boolean;
  onEnabled: (on: boolean) => void;
  /** The items in order. */
  items: T[];
  /** The most items allowed. */
  max: number;
  /** The blank item an Add press creates. */
  newItem: T;
  onItems: (items: T[]) => void;
  /** The name shown on an item's heading. */
  itemTitle: (item: T) => string;
  /** The item's own fields. */
  renderFields: (item: T, change: (next: T) => void) => ReactNode;
}

/** A switchable list of items with Add, Remove and per-item switches. */
export function HomeBlock<T extends { enabled: boolean }>({ title, enabled, onEnabled, items, max, newItem, onItems, itemTitle, renderFields }: HomeBlockProps<T>) {
  // Replace the item at [index] with [next].
  const change = (index: number, next: T) => onItems(items.map((item, i) => (i === index ? next : item)));
  // Remove the item at [index].
  const remove = (index: number) => onItems(items.filter((_, i) => i !== index));
  return (
    <div className="grid gap-3 rounded-md border border-line p-3">
      <SwitchRow label={`Show ${title}`} on={enabled} onChange={onEnabled} />
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-md border border-line bg-surface-alt p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold">{itemTitle(item) || `Item ${index + 1}`}</span>
            <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
          </div>
          <SwitchRow label="Show this item" on={item.enabled} onChange={(on) => change(index, { ...item, enabled: on })} />
          {renderFields(item, (next) => change(index, next))}
        </div>
      ))}
      <Button variant="secondary" disabled={items.length >= max} onClick={() => onItems([...items, newItem])}>
        Add item ({items.length} of {max})
      </Button>
    </div>
  );
}
