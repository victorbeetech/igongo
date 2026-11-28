// The dish page's money and rules, kept out of the screen so they can be tested:
// the price of one dish with its picks, the total for a quantity, the cart's
// option keys, and which required groups still need a pick.

import 'cart_line.dart';
import 'menu_item.dart';
import 'option_group.dart';

/// Picks on a dish: the choice keys picked in each group, by group key.
typedef DishPicks = Map<String, Set<String>>;

/// The price of ONE dish: its base price plus the price change of every picked choice.
int dishUnitPrice(MenuItem item, DishPicks picks) {
  // Step 1: start from the dish's own price.
  var price = item.price;
  // Step 2: add what each picked choice costs (free choices add nothing).
  for (final group in item.options) {
    final chosen = picks[group.key] ?? const <String>{};
    for (final choice in group.choices) {
      if (chosen.contains(choice.key)) price += choice.priceDelta;
    }
  }
  return price;
}

/// The total for [quantity] of the dish with [picks]: one price times how many.
int dishTotal(MenuItem item, DishPicks picks, int quantity) => dishUnitPrice(item, picks) * quantity;

/// The picks as cart option keys, `group:choice`, the form the cart and the API use.
List<String> dishCartOptions(DishPicks picks) => [
  for (final entry in picks.entries)
    for (final choice in entry.value) '${entry.key}:$choice',
];

/// The groups the restaurant marked required that have no pick yet, in menu order.
List<OptionGroup> dishMissingRequired(MenuItem item, DishPicks picks) => [
  for (final group in item.options)
    if (group.required && (picks[group.key]?.isEmpty ?? true)) group,
];

/// True when the restaurant requires a pick in some group, so the dish cannot be ordered without the dish page.
bool dishNeedsPicks(MenuItem item) => item.options.any((group) => group.required);

/// A one-dish cart line with no picks (a quick order from a food card): one dish at the base price.
CartLine quickCartLine(MenuItem item) => CartLine(
  itemId: item.id,
  name: item.name,
  quantity: 1,
  options: const [],
  unitPrice: item.price,
);

/// Picks or unpicks [choice] in [group]: a single-choice group keeps only the newest pick.
DishPicks dishTogglePick(DishPicks picks, OptionGroup group, String choice) {
  // Step 1: copy the picks so the old state is never changed in place.
  final next = {
    for (final e in picks.entries) e.key: {...e.value},
  };
  final set = next.putIfAbsent(group.key, () => <String>{});
  // Step 2: unpick if already picked; otherwise pick it (clearing others for single-choice groups).
  if (set.contains(choice)) {
    set.remove(choice);
  } else {
    if (!group.multiple) set.clear();
    set.add(choice);
  }
  return next;
}

/// Picks [choice] in a single-choice [group], replacing any earlier pick (radio buttons never un-pick).
DishPicks dishChoose(DishPicks picks, OptionGroup group, String choice) {
  // Step 1: copy the picks, then set this group to exactly the chosen key.
  final next = {
    for (final e in picks.entries) e.key: {...e.value},
  };
  next[group.key] = {choice};
  return next;
}
