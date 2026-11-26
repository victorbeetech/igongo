// S62-04 Cart, live: what is in the cart, with remove and the total. An
// empty cart shows a clear empty state with a way to the food shop. Checkout
// opens from here.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../app/navigation/open_target.dart';
import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../application/cart_controller.dart';
import 'checkout_sheet.dart';

/// The guest's cart screen.
class CartScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const CartScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    if (cart.lines.isEmpty) return _EmptyCart(purpose: screen.spec.purpose);
    final total = cart.lines.fold(0, (sum, l) => sum + l.quantity * l.unitPrice);
    return Column(
      children: [
        Expanded(
          child: ScreenListView(
            children: [
              PurposeText(screen.spec.purpose),
              for (var i = 0; i < cart.lines.length; i++)
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                  child: IgongoCard(
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(cart.lines[i].name, style: context.text.titleMedium),
                              Text(
                                '${cart.lines[i].quantity} × ${ugx(cart.lines[i].unitPrice)}',
                                style: context.text.bodySmall,
                              ),
                              if (cart.lines[i].note case final note?)
                                Text('Note: $note', style: context.text.bodySmall),
                            ],
                          ),
                        ),
                        Text(ugx(cart.lines[i].quantity * cart.lines[i].unitPrice)),
                        IconButton(
                          tooltip: 'Remove ${cart.lines[i].name}',
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () => ref.read(cartProvider.notifier).removeAt(i),
                        ),
                      ],
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                child: Text('Subtotal ${ugx(total)}', style: context.text.titleMedium),
              ),
            ],
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: IgongoButton(
              label: 'Check out',
              expand: true,
              onPressed: () => showModalBottomSheet<void>(
                context: context,
                isScrollControlled: true,
                builder: (_) => const CheckoutSheet(),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// The cart when nothing is in it: says so and offers the food shop.
class _EmptyCart extends StatelessWidget {
  const _EmptyCart({required this.purpose});

  /// The screen's purpose line.
  final String purpose;

  @override
  Widget build(BuildContext context) => ScreenListView(
    children: [
      PurposeText(purpose),
      Padding(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        child: Column(
          spacing: IgongoSpace.sm,
          children: [
            const Icon(Icons.shopping_cart_outlined, size: 48),
            Text('Your cart is empty', style: context.text.titleMedium, textAlign: TextAlign.center),
            const Text('Add dishes from the food shop to order.', textAlign: TextAlign.center),
            IgongoButton(label: 'Browse food', onPressed: () => openTarget(context, 'S62-01')),
          ],
        ),
      ),
    ],
  );
}
