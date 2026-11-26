// Reads the option groups typed on the item editor, one group per line:
//   Portion (required): Half kg = 0, 1 kg = 18000
//   Extras (several): Chips = 3000, Salad = 2000
// so staff can set portions and extras without a complex form.

import type { OptionGroup } from "@/shared/api/types/optionGroup";

/** A key from words, such as "1 kg" -> "1-kg". */
const keyOf = (words: string) => words.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "x";

/** The option groups in [text]. Lines without a colon are skipped. */
export function parseOptions(text: string): OptionGroup[] {
  return text.split("\n").flatMap((line) => {
    const [head, list] = line.split(":");
    if (!head || !list) return [];
    const name = head.replace(/\((required|several)\)/g, "").trim();
    const choices = list.split(",").map((c) => {
      const [n, delta] = c.split("=");
      return { key: keyOf(n ?? ""), name: (n ?? "").trim(), priceDelta: Number(delta) || 0 };
    }).filter((c) => c.name);
    return choices.length ? [{ key: keyOf(name), name, required: head.includes("(required)"), multiple: head.includes("(several)"), choices }] : [];
  });
}
