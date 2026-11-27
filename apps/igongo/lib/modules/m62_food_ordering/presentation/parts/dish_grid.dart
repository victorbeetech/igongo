// The menu grid: two dish cards per row, inside the screen's scrolling list.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../domain/item_stars.dart';
import '../../domain/menu_item.dart';
import 'dish_card.dart';

/// Two dish cards per row.
class DishGrid extends StatelessWidget {
  /// Creates the grid of [items]; [onOpen] opens a dish page.
  const DishGrid({super.key, required this.items, required this.stars, required this.onOpen});

  /// The dishes to show, in order.
  final List<MenuItem> items;

  /// Each dish's rating, by item ID.
  final Map<String, ItemStars> stars;

  /// Opens the dish page for one dish.
  final void Function(MenuItem item) onOpen;

  @override
  Widget build(BuildContext context) => GridView.count(
    crossAxisCount: 2,
    shrinkWrap: true,
    // The screen's list scrolls, so the grid does not.
    physics: const NeverScrollableScrollPhysics(),
    crossAxisSpacing: IgongoSpace.sm,
    mainAxisSpacing: IgongoSpace.sm,
    childAspectRatio: 0.7,
    children: [
      for (final i in items)
        DishCard(item: i, stars: stars[i.id]?.words, onOpen: i.available ? () => onOpen(i) : null),
    ],
  );
}
