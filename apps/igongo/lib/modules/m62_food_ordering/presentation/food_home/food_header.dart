// The top row of the Food tab: the venue the order is for, and a cart button
// with the number of dishes in the cart (the count hides at zero).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/badge/count_badge.dart';

/// The Food tab's top row.
class FoodHeader extends StatelessWidget {
  /// Creates the row for [venue], showing [count] dishes in the cart. [onCart] opens the cart.
  const FoodHeader({super.key, required this.venue, required this.count, required this.onCart});

  /// The venue the order is for, shown beside the pin.
  final String venue;

  /// How many dishes are in the cart.
  final int count;

  /// Called when the cart button is tapped.
  final VoidCallback onCart;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the pin and the venue name, cut short with dots if it is long.
    return Row(
      children: [
        Icon(Icons.location_on_outlined, size: 18, color: p.primaryText),
        const SizedBox(width: IgongoSpace.xs),
        Expanded(
          child: Text(
            'Cottage — • $venue',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700, color: p.text),
          ),
        ),
        // Step 2: the cart button, with its dish count on the corner.
        IconButton(
          tooltip: 'Cart',
          onPressed: onCart,
          style: IconButton.styleFrom(
            backgroundColor: p.surfaceAlt,
            foregroundColor: p.text,
            minimumSize: const Size.square(IgongoTouch.minimum),
          ),
          icon: CountBadge(
            count: count,
            background: p.primary,
            foreground: p.onPrimary,
            child: const Icon(Icons.shopping_bag_outlined),
          ),
        ),
      ],
    );
  }
}
