// One outlet's row on the Menus screen: its name, and how many dishes are on
// today's menu and how many are out. A failed menu read shows a short notice
// only, never the raw error.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../m62_food_ordering/application/orders_providers.dart';
import '../../m62_food_ordering/domain/menu_item.dart';
import '../../m62_food_ordering/domain/outlet.dart';

/// One outlet's line in the Menus list.
class OutletMenuRow extends ConsumerWidget {
  /// Creates the row for [outlet].
  const OutletMenuRow(this.outlet, {super.key});

  /// The outlet this row shows.
  final Outlet outlet;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: this outlet's menu, loaded from the API.
    final menu = ref.watch(menuProvider(outlet.key));
    return menu.when(
      loading: () => ListTile(title: Text(outlet.name), subtitle: const Text('Loading the menu…')),
      error: (_, _) => ListTile(title: Text(outlet.name), subtitle: const Text('Menu not available right now.')),
      data: (items) => ListTile(title: Text(outlet.name), subtitle: Text(_summary(items))),
    );
  }

  /// "12 dishes on today's menu · 2 out today", leaving out takeaway containers.
  static String _summary(List<MenuItem> items) {
    // Step 1: containers are sold as menu items, but they are not dishes.
    final dishes = items.where((i) => !i.isContainer).toList();
    // Step 2: count the dishes that are out for today.
    final out = dishes.where((i) => !i.available).length;
    final base = '${dishes.length} dishes on today\'s menu';
    return out == 0 ? base : '$base · $out out today';
  }
}
