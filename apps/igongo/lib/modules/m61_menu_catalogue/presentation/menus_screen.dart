// S61-01 Menus, live: every outlet that takes app orders, with how many of its
// dishes are on today's menu and how many are out. The outlets and menus come
// from the menu API (`/api/menu`). Signed out or in preview, the prototype shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/section/section_header.dart';
import '../../m62_food_ordering/application/orders_providers.dart';
import '../../m62_food_ordering/domain/outlet.dart';
import 'outlet_menu_row.dart';

/// The Menus screen: one row per outlet inside a card.
class MenusScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MenusScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Outlet>>(
    screenName: screen.spec.name,
    value: ref.watch(outletsProvider),
    onRetry: () => ref.invalidate(outletsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, outlets, _) => ScreenListView(
      children: [
        const SectionHeader('Outlets'),
        // Step 1: no outlet yet, so say so plainly.
        if (outlets.isEmpty)
          const Padding(
            padding: EdgeInsets.all(IgongoSpace.lg),
            child: Text('No outlet takes app orders yet.'),
          )
        else
          // Step 2: one row per outlet, each reading its own menu.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: IgongoCard(
              child: Column(children: [for (final o in outlets) OutletMenuRow(o)]),
            ),
          ),
      ],
    ),
  );
}
