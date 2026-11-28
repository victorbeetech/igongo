// The bar pinned to the bottom of the dish page: the quantity stepper on the
// left and Order now on the right, showing the live total. It respects the
// phone's bottom safe area.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../cart/quantity_stepper.dart';

/// The stepper and the Order now button, with the total.
class DishOrderBar extends StatelessWidget {
  /// Creates the bar.
  const DishOrderBar({
    super.key,
    required this.quantity,
    required this.total,
    required this.canAdd,
    required this.onQuantity,
    required this.onOrder,
  });

  /// How many dishes are chosen.
  final int quantity;

  /// The total for [quantity], with the picked options.
  final int total;

  /// False when the dish is out today: the button is then disabled.
  final bool canAdd;

  /// Called with the new count from the stepper.
  final ValueChanged<int> onQuantity;

  /// Orders the dish now: checkout opens for it, skipping the cart.
  final VoidCallback onOrder;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface,
      elevation: IgongoElevation.sheet,
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, IgongoSpace.md),
          child: Row(
            children: [
              // Step 1: how many (the stepper stops at one).
              QuantityStepper(quantity: quantity, onChanged: onQuantity),
              const SizedBox(width: IgongoSpace.md),
              // Step 2: Order now, with the live total; disabled when the dish is out today.
              Expanded(
                child: IgongoButton(
                  label: canAdd ? 'Order now  •  ${ugx(total)}' : 'Not available today',
                  expand: true,
                  onPressed: canAdd ? onOrder : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
