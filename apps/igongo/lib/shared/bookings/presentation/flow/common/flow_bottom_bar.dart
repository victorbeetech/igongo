// The sticky footer of a booking-flow screen: the amount due on the left and
// the main action button on the right. Amounts are placeholders until the API
// supplies them.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/button/igongo_button.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';

/// A bottom bar with [caption] and an amount on the left, and a [buttonLabel] button on the right.
class FlowBottomBar extends StatelessWidget {
  /// Creates the bar. [amount] defaults to the amount placeholder.
  const FlowBottomBar({
    super.key,
    required this.caption,
    required this.buttonLabel,
    required this.icon,
    this.amount = kAmountPlaceholder,
    this.onPressed,
  });

  /// Small uppercase line above the amount, for example "Due today (deposit)".
  final String caption;

  /// The amount text (a placeholder until the API supplies it).
  final String amount;

  /// The button text, for example "Confirm Booking".
  final String buttonLabel;

  /// The icon on the button.
  final IconData icon;

  /// Called when the guest taps the button. Null until the action is wired.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: a surface with a thin top border, padded for the phone's bottom edge.
    return Container(
      decoration: BoxDecoration(color: palette.surface, border: Border(top: BorderSide(color: palette.border))),
      child: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.sm),
        child: Row(
          children: [
            // Step 2: the caption and amount.
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    caption.toUpperCase(),
                    style: context.text.labelSmall?.copyWith(color: palette.textMuted, letterSpacing: 1),
                  ),
                  Text(
                    amount,
                    style: context.text.titleMedium?.copyWith(color: palette.primary, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
            // Step 3: the main action.
            IgongoButton(label: buttonLabel, icon: icon, onPressed: onPressed ?? () {}),
          ],
        ),
      ),
    );
  }
}
