// S62-04 Cart, redesigned: a photo banner at the top with the cart count, then
// either the empty state (illustration, Browse Services, popular services) or
// the items as cards with a summary and a Proceed to Checkout button. The app
// frame and bottom bar come from the shell.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/screen_context.dart';
import '../../../../shared/format/hotel_day.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../application/cart_controller.dart';
import '../checkout_sheet.dart';
import 'cart_banner.dart';
import 'cart_item_card.dart';
import 'cart_summary.dart';
import 'empty_cart_view.dart';

/// The guest's cart screen.
class CartScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const CartScreen(this.screen, {super.key});

  /// The screen's context (its catalog entry).
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the cart as it is now (the lines are kept while the app runs).
    final lines = ref.watch(cartProvider).lines;
    final controller = ref.read(cartProvider.notifier);
    return ListView(
      padding: const EdgeInsets.only(bottom: IgongoSpace.xxl),
      children: [
        // Step 2: the banner at the top of every cart state.
        const CartBanner(),
        const SizedBox(height: IgongoSpace.md),
        if (lines.isEmpty)
          // Step 3a: nothing added yet.
          const EmptyCartView()
        else ...[
          // Step 3b: the header with a count and a clear-all action.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: Row(
              children: [
                Expanded(child: Text('Your items (${lines.length})', style: context.text.titleMedium)),
                TextButton.icon(
                  onPressed: controller.clear,
                  icon: Icon(Icons.delete_sweep_outlined, color: context.palette.primary),
                  label: Text('Clear cart', style: TextStyle(color: context.palette.primary)),
                ),
              ],
            ),
          ),
          // Step 4: every line as its own card.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: Column(
              children: [
                for (var i = 0; i < lines.length; i++)
                  CartItemCard(
                    line: lines[i],
                    onQuantity: (q) => controller.setQuantity(i, q),
                    onDelete: () => controller.removeAt(i),
                    onDate: () => _pickDate(context, controller, i, lines[i].date),
                  ),
                // Step 5: the subtotal, service charge and total, priced by the server.
                const SizedBox(height: IgongoSpace.sm),
                CartSummary(lines: lines),
                const SizedBox(height: IgongoSpace.lg),
                // Step 6: the prominent checkout button, which opens the checkout sheet.
                IgongoButton(
                  label: 'Proceed to Checkout',
                  icon: Icons.account_balance_wallet_outlined,
                  expand: true,
                  onPressed: () => showModalBottomSheet<void>(
                    context: context,
                    isScrollControlled: true,
                    builder: (_) => const CheckoutSheet(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

/// Asks for the day of line [index] (from today, up to 60 days on) and saves it.
Future<void> _pickDate(BuildContext context, CartController controller, int index, DateTime? current) async {
  // Step 1: the first day that can be chosen is the hotel's today.
  final today = hotelDay();
  // Step 2: start on the line's day, or today when it has none yet or it has passed.
  final start = current != null && !current.isBefore(today) ? current : today;
  final picked = await showDatePicker(
    context: context,
    initialDate: start,
    firstDate: today,
    lastDate: today.add(const Duration(days: 60)),
  );
  // Step 3: save the chosen day (a cancelled picker changes nothing).
  if (picked != null) controller.setDate(index, picked);
}
