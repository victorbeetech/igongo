// The food shop entry on the guest home: an edge-to-edge slideshow of meals. Each slide is a
// dish photo and name; tapping a slide opens that dish, and an empty menu shows
// one food photo that opens the food home (S62-01).

import 'package:material_ui/material_ui.dart';

import '../../../m62_food_ordering/presentation/menu_carousel.dart';

/// The home's meals slideshow card.
class FoodShopCard extends StatelessWidget {
  /// Creates the card; [onTap] opens the food home when there are no dishes yet.
  const FoodShopCard({super.key, required this.onTap});

  /// Called when the empty-state photo is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Meals to order',
    // No side margins and no rounded corners: it runs to the phone edges.
    child: MenuCarousel(onEmptyTap: onTap),
  );
}
