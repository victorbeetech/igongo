// S62-01..08 Order food, live, in the order of the Food Panda reference:
//   1. the search box,
//   2. the restaurants (a slider of same-size cards),
//   3. today's menu (an image-only slideshow, 2.5 seconds per slide),
//   4. the section tabs,
//   5. the dishes, two cards per row.
// A dish opens its own page (options, add-ons, drinks and a note) from its
// card; the cart and checkout come only after that. Out-of-stock dishes show
// "Out today" and cannot be opened. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/section/section_header.dart';
import '../application/cart_controller.dart';
import '../application/menu_section.dart';
import '../application/orders_providers.dart';
import '../domain/outlet.dart';
import 'checkout_sheet.dart';
import 'item_sheet.dart';
import 'parts/dish_grid.dart';
import 'parts/menu_slideshow.dart';
import 'parts/restaurant_slider.dart';
import 'parts/section_tabs.dart';

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
      // The search text narrows the dishes by name (not case sensitive).
      final query = ref.watch(menuSearchProvider).trim().toLowerCase();
      // The section tab the guest picked (null means the first one).
      final picked = ref.watch(menuSectionProvider);
      return Column(
        children: [
          Expanded(
            child: ScreenListView(
              children: [
                PurposeText(screen.spec.purpose),
                // Step 1: the search box, above the restaurants and dishes.
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                  child: TextField(
                    decoration: const InputDecoration(hintText: 'Search menu', prefixIcon: Icon(Icons.search)),
                    onChanged: (text) => ref.read(menuSearchProvider.notifier).set(text),
                  ),
                ),
                // Step 2: the restaurants, as a slider of same-size cards.
                const SectionHeader('Restaurants'),
                RestaurantSlider(
                  outlets: outlets,
                  selected: outlet,
                  onPick: (key) => ref.read(cartProvider.notifier).useOutlet(key),
                ),
                ...menu.when(
                  loading: () => [const LinearProgressIndicator()],
                  error: (e, _) => [Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('$e'))],
                  data: (all) {
                    // Only dishes whose name matches the search, in menu order.
                    final items = [
                      for (final i in all)
                        if (query.isEmpty || i.name.toLowerCase().contains(query)) i,
                    ];
                    // Today's menu: the dishes on sale today, up to eight slides.
                    final today = [
                      for (final i in all)
                        if (i.available) i,
                    ].take(8).toList();
                    // The section tabs, in menu order, and the one showing now.
                    final sections = [for (final i in items) i.section].toSet().toList();
                    final current = sections.contains(picked) ? picked : (sections.isEmpty ? null : sections.first);
                    final shown = [
                      for (final i in items)
                        if (i.section == current) i,
                    ];
                    return [
                      // Step 3: today's menu, image only, edge to edge, on a 2.5-second slideshow.
                      if (query.isEmpty && today.isNotEmpty) ...[
                        const SectionHeader("Today's menu"),
                        MenuSlideshow(items: today),
                      ],
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
                      // Step 4: the section tabs.
                      if (current != null) ...[
                        const SizedBox(height: IgongoSpace.md),
                        SectionTabs(
                          sections: sections,
                          selected: current,
                          onPick: (s) => ref.read(menuSectionProvider.notifier).pick(s),
                        ),
                        const SizedBox(height: IgongoSpace.sm),
                      ],
                      // Step 5: the dishes, two cards per row. A card opens the dish page.
                      if (shown.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                          child: DishGrid(
                            items: shown,
                            stars: stars,
                            onOpen: (i) {
                              ref.read(cartProvider.notifier).useOutlet(outlet);
                              _open(context, ItemSheet(item: i));
                            },
                          ),
                        ),
                    ];
                  },
                ),
              ],
            ),
          ),
          // The checkout bar appears only once a dish is in the cart.
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
