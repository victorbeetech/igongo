// One line of a pricing summary: a label on the left and an amount on the
// right. The total line is bold and in the primary red.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// A label and amount pair for a summary card.
class FlowPriceRow extends StatelessWidget {
  /// Creates the row. Set [total] for the bold red total style.
  const FlowPriceRow({super.key, required this.label, required this.amount, this.total = false});

  /// The line label, for example "2 Adults (Guided Tour)".
  final String label;

  /// The amount text, a placeholder until the API supplies it.
  final String amount;

  /// True for the bold, red total line.
  final bool total;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: label on the left, amount on the right, both on one baseline.
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xxs),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          Expanded(
            child: Text(
              label,
              style: total
                  ? context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)
                  : context.text.bodyMedium?.copyWith(color: palette.textMuted),
            ),
          ),
          Text(
            amount,
            style: total
                ? context.text.titleMedium?.copyWith(color: palette.primary, fontWeight: FontWeight.w700)
                : context.text.bodyMedium?.copyWith(color: palette.text),
          ),
        ],
      ),
    );
  }
}
