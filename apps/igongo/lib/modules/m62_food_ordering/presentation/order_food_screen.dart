// S62-01..08 The Food tab, live: pick a venue, tap dishes to add them, then check out.
// Layout, top to bottom: the venue and cart row, the search row, the section pills,
// the Resort Venues strip, the dish grid, out-of-stock dishes, a farm note. The
// Your order bar sits at the bottom when the cart has dishes. The app shell
// already shows the WhatsApp button on guest screens, so this screen does not add
// another one. Every venue, dish, price and section comes from the
// menu API; nothing here is sample data. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/home/tile_grid.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/photo/guest_photos.dart';
import '../../../shared/ui/section/section_header.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../domain/cart_total.dart';
import '../domain/order_type.dart';
import '../domain/ordering_rules.dart';
import '../domain/outlet.dart';
import 'checkout_sheet.dart';
import 'food_home/category_pills.dart';
import 'food_home/dish_card.dart';
import 'food_home/farm_tip.dart';
import 'food_home/pre_order_card.dart';
import 'food_home/food_top_bar.dart';
import 'food_home/food_search_bar.dart';
import 'food_home/food_section_title.dart';
import 'food_home/order_summary_bar.dart';
import 'food_home/venue_card.dart';
import 'food_home/venue_row.dart';
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

  /// A venue's photo: Kaahwa Kanuzire has its photo, and any other venue shows
  /// the placeholder until the server sends one.
  static String? _venuePhoto(Outlet o) {
    // Step 1: Kaahwa Kanuzire is matched by name (the real outlet has no photo field yet).
    if (o.name.toLowerCase().contains('kaahwa')) return GuestPhotos.hotelKaahwaKanuzire;
    return null;
  }

  /// Words for the order types a venue takes, shown as small tags on its card.
  static List<String> _badgesOf(Outlet o, OrderingRules? rules) => [
    for (final t in rules?.typesAt(o.key) ?? const <String>[])
      orderTypeWords(t),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<Outlet>>(
    screenName: screen.spec.name,
    value: ref.watch(outletsProvider),
    onRetry: () => ref.invalidate(outletsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, outlets, _) {
      if (outlets.isEmpty) return const Center(child: Text('No outlet takes app orders yet.'));
      // Step 1: the cart, its dish count and total, and the venue it orders from (the first one until a choice is made).
      final cart = ref.watch(cartProvider);
      final count = ref.watch(cartCountProvider);
      final total = cartTotalOf(cart);
      final outlet = outlets.any((o) => o.key == cart.outlet) ? cart.outlet! : outlets.first.key;
      final venueName = outlets.firstWhere((o) => o.key == outlet, orElse: () => outlets.first).name;
      // Step 2: the live menu for that venue, the guests' stars, and the search and section choices.
      final menu = ref.watch(menuProvider(outlet));
      final stars = ref.watch(starsProvider).valueOrNull ?? const {};
      final query = ref.watch(menuSearchProvider).trim().toLowerCase();
      final category = ref.watch(menuCategoryProvider);
      final rules = ref.watch(orderingRulesProvider).valueOrNull;
      return Column(
        children: [
          // Step 3: the one-row top bar (venue, wish list, WhatsApp); the cart is in the bottom bar.
          FoodTopBar(venue: venueName),
          Expanded(
            child: ScreenListView(
              children: [
                // Step 3b: the search row and the section pills.
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
                  child: FoodSearchBar(
                    onChanged: (text) => ref.read(menuSearchProvider.notifier).set(text),
                    onFilter: () => showIgongoToast(context, 'Filters are coming soon.'),
                  ),
                ),
                ...menu.when(
                  loading: () => [const LinearProgressIndicator()],
                  error: (e, _) => [Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('$e'))],
                  data: (all) {
                    // Step 4: the sections (the pills), then only the dishes that match the pill and the search.
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
                    // Step 5: dishes on today first; out-of-stock dishes go last.
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
                        Padding(
                          padding: const EdgeInsets.only(top: IgongoSpace.md),
                          child: CategoryPills(
                            labels: ['All', ...sections],
                            selected: category ?? 'All',
                            onSelected: (l) => ref.read(menuCategoryProvider.notifier).set(l == 'All' ? null : l),
                          ),
                        ),
                      // Step 6: the venues, from the real outlets; tapping one makes it the cart's venue.
                      Padding(
                        padding: const EdgeInsets.only(top: IgongoSpace.lg),
                        child: VenueRow(
                          itemCount: outlets.length,
                          itemBuilder: (_, i, highlighted) {
                            final o = outlets[i];
                            return VenueCard(
                              name: o.name,
                              detail: 'Open for app orders',
                              badges: _badgesOf(o, rules),
                              selected: highlighted,
                              photo: _venuePhoto(o),
                              onTap: () {
                                ref.read(menuCategoryProvider.notifier).set(null);
                                ref.read(cartProvider.notifier).useOutlet(o.key);
                              },
                            );
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
                      // Step 7: the dish grid, two to a row, under the chosen section's name.
                      if (onToday.isNotEmpty) ...[
                        FoodSectionTitle(
                          title: category ?? "Chef's Signatures",
                          subtitle: 'Freshly prepared to order • Executive Chef —',
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                          child: TileGrid(
                            children: [
                              for (final i in onToday)
                                DishCard(
                                  name: i.name,
                                  price: ugx(i.price),
                                  description: i.description ?? stars[i.id]?.words,
                                  photo: i.photoUrl,
                                  onAdd: () {
                                    ref.read(cartProvider.notifier).useOutlet(outlet);
                                    openItemPage(context, i);
                                  },
                                ),
                            ],
                          ),
                        ),
                      ],
                      // Tomorrow's special: layout only, until the API has pre-orders.
                      const Padding(
                        padding: EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, 0),
                        child: PreOrderCard(),
                      ),
                      // Step 8: out-of-stock dishes, dimmed and last, in a "Not available" card.
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
                      // Step 9: the farm note, then room so the last card clears the Your order bar.
                      const Padding(
                        padding: EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.xl, IgongoSpace.lg, 0),
                        child: FarmTip(),
                      ),
                      const SizedBox(height: 120),
                    ];
                  },
                ),
              ],
            ),
          ),
          // Step 11: the Your order bar, only while the cart has dishes.
          if (count > 0)
            OrderSummaryBar(count: count, total: total, onView: () => _open(context, const CheckoutSheet())),
        ],
      );
    },
  );
}
