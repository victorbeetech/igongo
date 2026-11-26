/**
 * Short helpers for writing a module's default set-up, so each module's
 * domain file reads like the spec. Only used for defaults; the super admin
 * edits the saved set-up as plain data afterwards.
 *
 * @example
 *   fields: [field("item", "Item", "text", { required: true, inList: true }), field("photo", "Photo", "photo")]
 *   statuses: steps("Requested", "Approved!", "Done.", "Rejected.")
 */

import type { FieldDef, FieldKind } from "./field-def";
import type { StatusDef } from "./status-def";

/** A field. */
export function field(key: string, label: string, kind: FieldKind = "text", more: Omit<FieldDef, "key" | "label" | "kind"> = {}): FieldDef {
  return { key, label, kind, ...more };
}

/** A select field with its choices. */
export function choice(key: string, label: string, options: string[], more: Omit<FieldDef, "key" | "label" | "kind" | "options"> = {}): FieldDef {
  return { key, label, kind: "select", options, ...more };
}

/** `Approved!` -> needs an approver; `Done.` -> closes the record; `Checked!.` -> both. The key is the words in snake case. */
export function steps(...labels: string[]): StatusDef[] {
  return labels.map((raw) => {
    // Trailing marks: "!" approval, "." done; "Checked!." is both.
    const marks = /[!.]*$/.exec(raw)?.[0] ?? "";
    const approval = marks.includes("!");
    const done = marks.includes(".");
    const label = raw.slice(0, raw.length - marks.length);
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return { key, label, ...(approval ? { approval } : {}), ...(done ? { done } : {}) };
  });
}
