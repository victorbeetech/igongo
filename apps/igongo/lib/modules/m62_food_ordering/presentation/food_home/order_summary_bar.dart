// The "Your order" bar that shows while the cart has dishes: the dish count, the
// total so far and a View cart button that opens checkout. Red, with the same
// colours in light and dark mode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/badge/count_badge.dart';

/// The bottom order bar.
class OrderSummaryBar extends StatelessWidget {
  /// Creates the bar for [count] dishes worth [total] shillings. [onView] opens checkout.
  const OrderSummaryBar({super.key, required this.count, required this.total, required this.onView});

  /// How many dishes are in the cart.
  final int count;

  /// The total in whole shillings.
  final int total;

  /// Called by the View cart button.
  final VoidCallback onView;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    // Step 1: the red bar, kept clear of the phone's bottom edge.
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.sm),
        child: Material(
          color: p.primary,
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.sm),
            child: Row(
              children: [
                // Step 2: the bag icon with the dish count on its corner.
                CountBadge(
                  count: count,
                  background: p.onPrimary,
                  foreground: p.primary,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: Color.lerp(p.primary, p.onPrimary, 0.15),
                      borderRadius: BorderRadius.circular(IgongoRadius.md),
                    ),
                    child: Icon(Icons.shopping_bag_outlined, color: p.onPrimary, size: 20),
                  ),
                ),
                const SizedBox(width: IgongoSpace.sm),
                // Step 3: the words and the running total.
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your order',
                        style: text.labelSmall?.copyWith(color: p.onPrimary),
                      ),
                      Text(
                        ugx(total),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.onPrimary),
                      ),
                    ],
                  ),
                ),
                // Step 4: the View cart button.
                FilledButton(
                  onPressed: onView,
                  style: FilledButton.styleFrom(
                    backgroundColor: p.secondary,
                    foregroundColor: p.background,
                    minimumSize: const Size(0, IgongoTouch.minimum),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [Text('View cart'), SizedBox(width: IgongoSpace.xs), Icon(Icons.arrow_forward, size: 16)],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
