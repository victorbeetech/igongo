// S62-01..08 Order food, live: pick an outlet, tap dishes to add them, then
// check out. Out-of-stock dishes show but cannot be added. Signed out, the
// prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../shared/ui/section/section_header.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../domain/outlet.dart';
import 'checkout_sheet.dart';
import 'item_sheet.dart';

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
      return Column(
        children: [
          Expanded(
            child: ScreenListView(
              children: [
                PurposeText(screen.spec.purpose),
                // Step 2: the search box, above the outlets and dishes.
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                  child: TextField(
                    decoration: const InputDecoration(hintText: 'Search menu', prefixIcon: Icon(Icons.search)),
                    onChanged: (text) => ref.read(menuSearchProvider.notifier).set(text),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                  child: Wrap(
                    spacing: IgongoSpace.sm,
                    children: [
                      for (final o in outlets)
                        ChoiceChip(
                          label: Text(o.name),
                          selected: o.key == outlet,
                          onSelected: (_) => ref.read(cartProvider.notifier).useOutlet(o.key),
                        ),
                    ],
                  ),
                ),
                ...menu.when(
                  loading: () => [const LinearProgressIndicator()],
                  error: (e, _) => [Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('$e'))],
                  data: (all) {
                    // Step 3: only the dishes whose name matches the search.
                    final items = [
                      for (final i in all)
                        if (query.isEmpty || i.name.toLowerCase().contains(query)) i,
                    ];
                    return [
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
                      for (final section in {for (final i in items) i.section}) ...[
                        SectionHeader(section),
                        for (final i in items.where((i) => i.section == section))
                          IgongoListRow(
                            title: i.name,
                            subtitle: [ugx(i.price), ?stars[i.id]?.words].join(' · '),
                            status: i.available ? null : 'Out today',
                            onTap: i.available
                                ? () {
                                    ref.read(cartProvider.notifier).useOutlet(outlet);
                                    _open(context, ItemSheet(item: i));
                                  }
                                : null,
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
