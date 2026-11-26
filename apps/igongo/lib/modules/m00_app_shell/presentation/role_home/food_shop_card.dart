// The food shop entry on the guest home: a large card that opens the food
// home (menus, outlets and ordering, S62-01). Shown first, above the text tiles.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

/// A large, tappable card that opens the food shop.
class FoodShopCard extends StatelessWidget {
  /// Creates the food shop card; [onTap] opens the food home.
  const FoodShopCard({super.key, required this.onTap});

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    // Step 1: the theme's colours, so light and dark both read well.
    final scheme = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      label: 'Food shop: order food for delivery, dine-in, takeaway or pre-order',
      child: Material(
        color: scheme.primary,
        borderRadius: BorderRadius.circular(IgongoSpace.lg),
        child: InkWell(
          // Step 2: the whole card opens the food home.
          borderRadius: BorderRadius.circular(IgongoSpace.lg),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Row(
              children: [
                // Step 3: the title and what it offers, then the icon.
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Food shop', style: TextStyle(color: scheme.onPrimary, fontSize: 22, fontWeight: FontWeight.bold)),
                      const SizedBox(height: IgongoSpace.xs),
                      Text(
                        'Order for delivery, dine-in, takeaway or pre-order',
                        style: TextStyle(color: scheme.onPrimary),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.restaurant_menu, color: scheme.onPrimary, size: 36),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
