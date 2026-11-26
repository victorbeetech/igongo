/**
 * Prices one cart line from the menu item and the option keys the guest
 * picked, checking the picks against the item's option groups.
 */

import type { MenuItemRef } from "@igongo/contracts/menu-catalogue";
import { AppError } from "@igongo/core";
import type { ChosenOption, OrderLine } from "./order-line";

/**
 * The priced line.
 * @param picks option picks as `group:choice` keys, such as `portion:1kg`
 * @throws AppError when a required group is missing, a pick is unknown, or one-only groups get two picks
 */
export function priceLine(item: MenuItemRef, quantity: number, picks: string[], notes: string | null): OrderLine {
  const options: ChosenOption[] = picks.map((pick) => {
    const [groupKey, choiceKey] = pick.split(":");
    const group = item.options.find((g) => g.key === groupKey);
    const choice = group?.choices.find((ch) => ch.key === choiceKey);
    if (!group || !choice) throw new AppError("bad_request", `"${pick}" is not an option of ${item.name}.`);
    return { group: group.key, key: choice.key, name: choice.name, priceDelta: choice.priceDelta };
  });
  for (const group of item.options) {
    const count = options.filter((o) => o.group === group.key).length;
    if (group.required && count === 0) throw new AppError("bad_request", `Choose ${group.name.toLowerCase()} for ${item.name}.`);
    if (!group.multiple && count > 1) throw new AppError("bad_request", `Choose only one ${group.name.toLowerCase()} for ${item.name}.`);
  }
  const unitPrice = item.price + options.reduce((sum, o) => sum + o.priceDelta, 0);
  return { itemId: item.itemId, name: item.name, quantity, unitPrice, options, notes, lineTotal: unitPrice * quantity };
}
