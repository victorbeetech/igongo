// The "From our kitchen" row: a horizontal list of dish cards. Dishes come from the
// first outlet's menu in the API (only items on today and not containers). While
// loading, or when there are no dishes, placeholder cards keep the same layout.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../m62_food_ordering/application/cart_controller.dart';
import '../../../../m62_food_ordering/application/orders_providers.dart';
import '../../../../m62_food_ordering/domain/menu_item.dart';
import '../../../../m62_food_ordering/presentation/item_page.dart';
import 'guest_dish_card.dart';

/// The horizontal row of dish cards on the guest home.
class GuestDishRow extends ConsumerWidget {
  /// Creates the row.
  const GuestDishRow({super.key});

  /// The tags on the placeholder cards, as the design shows them (words only, no data).
  static const _placeholderTags = ['Best seller', 'Chef specialty', 'Wood smoked'];

  /// The tag on real dishes until the menu API carries a tag.
  static const _realTag = 'On the menu';

  /// The rating and prep time are dashes until the menu API carries them.
  static const _placeholderRating = '— (—)';
  static const _placeholderPrepTime = '— mins';

  /// The row's height: the card plus room for its shadow.
  static const _rowHeight = 280.0;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the first outlet, then its available dishes (containers are not dishes).
    final outlet = ref.watch(outletsProvider).valueOrNull?.firstOrNull;
    final items = outlet == null
        ? const <MenuItem>[]
        : [
            for (final i in ref.watch(menuProvider(outlet.key)).valueOrNull ?? const <MenuItem>[])
              if (i.available && !i.isContainer) i,
          ];

    // Step 2: real dishes when there are any; otherwise placeholder cards in the same layout.
    final cards = items.isEmpty
        ? [
            for (var i = 0; i < _placeholderTags.length; i++)
              GuestDishCard(
                name: 'Dish name',
                description: 'Dishes will appear here',
                price: 'UGX —',
                tag: _placeholderTags[i],
                rating: _placeholderRating,
                prepTime: _placeholderPrepTime,
              ),
          ]
        : [
            for (final item in items)
              GuestDishCard(
                name: item.name,
                description: item.description ?? '',
                price: ugx(item.price),
                tag: _realTag,
                rating: _placeholderRating,
                prepTime: _placeholderPrepTime,
                onTap: () {
                  // Opening a dish sets its outlet as the cart's, then opens the dish page.
                  ref.read(cartProvider.notifier).useOutlet(outlet!.key);
                  openItemPage(context, item);
                },
              ),
          ];

    // Step 3: the cards in a row that scrolls sideways, with the same edge margins as the page.
    return Semantics(
      label: 'Meals to order',
      container: true,
      child: SizedBox(
        height: _rowHeight,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          itemCount: cards.length,
          separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.md),
          itemBuilder: (_, i) => cards[i],
        ),
      ),
    );
  }
}
