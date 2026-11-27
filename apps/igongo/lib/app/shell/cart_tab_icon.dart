// The Cart tab's icon in the bottom bar: the cart icon with the number of
// dishes in the cart on its corner. It reads the cart's count, so it updates
// as the guest adds or removes items.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../modules/m62_food_ordering/application/cart_controller.dart';
import '../../shared/theme/theme.dart';
import '../../shared/ui/badge/count_badge.dart';

/// The Cart tab icon, [icon] with the cart count on it.
class CartTabIcon extends ConsumerWidget {
  /// Creates the icon.
  const CartTabIcon({super.key, required this.icon});

  /// The tab's icon (the cart outline).
  final IconData icon;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: how many dishes are in the cart right now.
    final count = ref.watch(cartCountProvider);
    final palette = context.palette;
    // Step 2: the icon with the count on its corner (hidden at zero).
    return CountBadge(
      count: count,
      background: palette.primary,
      foreground: palette.onPrimary,
      child: Icon(icon),
    );
  }
}
