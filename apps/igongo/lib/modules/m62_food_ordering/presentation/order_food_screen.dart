// S62-01..08 Order food, live: pick an outlet, tap dishes to add them, then
// check out. Out-of-stock dishes show but cannot be added. Signed out, the
// prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/home/tile_grid.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/guest/guest_chip_row.dart';
import '../../../shared/ui/guest/guest_product_card.dart';
import '../../../shared/ui/guest/guest_search_header.dart';
import '../../../shared/ui/guest/guest_shop_row.dart';
import '../../../shared/ui/photo/guest_photos.dart';
import '../../../shared/ui/section/section_header.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../demo/demo_menu.dart';
import '../demo/demo_orders.dart';
import '../domain/order_type.dart';
import '../domain/outlet.dart';
import 'checkout_sheet.dart';
import 'demo_notice.dart';
import 'item_page.dart';

/// The guest's food ordering screen.
class OrderFoodScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const OrderFoodScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Opens [sheet] from the bottom.
  static Future<void> _open(BuildContext context, Widget sheet) =>
      showModalBottomSheet<void>(context: context, isScrollControlled: true, builder: (_) => sheet);

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Outlet>>(
    screenName: screen.spec.name,
    value: ref.watch(outletsProvider),
    onRetry: () => ref.invalidate(outletsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, outlets, _) {
      if (outlets.isEmpty) return const Center(child: Text('No outlet takes app orders yet.'));
      final cart = ref.watch(cartProvider);
      // The cart's outlet, or the first one.
      final outlet = outlets.any((o) => o.key == cart.outlet) ? cart.outlet! : outlets.first.key;
      final menu = ref.watch(menuProvider(outlet));
      final count = cart.lines.fold(0, (n, l) => n + l.quantity);
      // Guests' average stars per dish (none until the first ratings come in).
      final stars = ref.watch(starsProvider).valueOrNull ?? const {};
      // Step 1b: the search text narrows the dishes by name (not case sensitive).
      final query = ref.watch(menuSearchProvider).trim().toLowerCase();
      final category = ref.watch(menuCategoryProvider);
      final rules = ref.watch(orderingRulesProvider).valueOrNull;
      final demo = isDemoOutlet(outlet);
      // Step 1b: the order types an outlet offers, shown as badges on its row.
      List<String> badgesOf(Outlet o) => [
        for (final t in (isDemoOutlet(o.key) ? demoOrderTypes : (rules?.typesAt(o.key) ?? const <String>[])))
          orderTypeWords(t),
      ];
      return Column(
        children: [
          Expanded(
            child: ScreenListView(
              children: [
                // Step 2: the red search band.
                GuestSearchHeader(
                  hint: 'Search the menu',
                  onChanged: (text) => ref.read(menuSearchProvider.notifier).set(text),
                ),
                ...menu.when(
                  loading: () => [const LinearProgressIndicator()],
                  error: (e, _) => [Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('$e'))],
                  data: (all) {
                    // Step 3: the section chips, then only the dishes that match the chip and the search.
                    final sections = [
                      for (final s in {
                        for (final i in all)
                          if (!i.isContainer) i.section,
                      })
                        s,
                    ];
                    final items = [
                      for (final i in all)
                        if (!i.isContainer &&
                            (category == null || i.section == category) &&
                            (query.isEmpty || i.name.toLowerCase().contains(query)))
                          i,
                    ];
                    // Step 4: dishes on today first; out-of-stock dishes go last.
                    final onToday = [
                      for (final i in items)
                        if (i.available) i,
                    ];
                    final outToday = [
                      for (final i in items)
                        if (!i.available) i,
                    ];
                    return [
                      if (sections.length > 1)
                        GuestChipRow(
                          labels: ['All', ...sections],
                          selected: category ?? 'All',
                          onSelected: (l) => ref.read(menuCategoryProvider.notifier).set(l == 'All' ? null : l),
                        ),
                      if (demo) const DemoNotice(),
                      // Step 5: the shops (outlets), one row each; tap to switch.
                      const SectionHeader('Shops'),
                      for (final o in outlets)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.sm),
                          child: GuestShopRow(
                            title: o.name,
                            detail: 'Open for app orders',
                            badges: badgesOf(o),
                            selected: o.key == outlet,
                            photo: isDemoOutlet(o.key) ? GuestPhotos.outletRestaurant : null,
                            onTap: () {
                              ref.read(menuCategoryProvider.notifier).set(null);
                              ref.read(cartProvider.notifier).useOutlet(o.key);
                            },
                          ),
                        ),
                      if (all.isEmpty)
                        const Padding(
                          padding: EdgeInsets.all(IgongoSpace.lg),
                          child: Text('Nothing on this menu yet.'),
                        ),
                      if (all.isNotEmpty && items.isEmpty)
                        const Padding(
                          padding: EdgeInsets.all(IgongoSpace.lg),
                          child: Text('No dish matches your search.'),
                        ),
                      // Step 6: the dishes as one grid, two to a row (sections are the chips above).
                      if (onToday.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
                          child: TileGrid(
                            children: [
                              for (final i in onToday)
                                GuestProductCard(
                                  name: i.name,
                                  price: ugx(i.price),
                                  description: i.description,
                                  note: stars[i.id]?.words,
                                  onTap: () {
                                    ref.read(cartProvider.notifier).useOutlet(outlet);
                                    openItemPage(context, i);
                                  },
                                ),
                            ],
                          ),
                        ),
                      // Out-of-stock dishes: dimmed, last, in a "Not available" card.
                      if (outToday.isNotEmpty) ...[
                        const SectionHeader('Not available'),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                          child: IgongoCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                for (final i in outToday)
                                  Opacity(
                                    opacity: 0.5,
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xs),
                                      child: Text('${i.name} · ${ugx(i.price)}'),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ];
                  },
                ),
              ],
            ),
          ),
          if (count > 0)
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(IgongoSpace.md),
                child: IgongoButton(
                  label: 'Check out ($count)',
                  expand: true,
                  onPressed: () => _open(context, const CheckoutSheet()),
                ),
              ),
            ),
        ],
      );
    },
  );
}
