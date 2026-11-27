// The quantity control: a minus button, the count, and a plus button in a
// rounded pill. Minus stops at one (delete removes the item instead).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The +/- control for one cart line.
class QuantityStepper extends StatelessWidget {
  /// Creates the control showing [quantity].
  const QuantityStepper({super.key, required this.quantity, required this.onChanged});

  /// How many now.
  final int quantity;

  /// Called with the new count when + or - is tapped.
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      decoration: BoxDecoration(
        color: palette.surfaceAlt,
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step 1: minus, disabled at one.
          IconButton(
            tooltip: 'Less',
            icon: const Icon(Icons.remove),
            onPressed: quantity > 1 ? () => onChanged(quantity - 1) : null,
          ),
          // Step 2: the count, read by screen readers as a number.
          SizedBox(
            width: 28,
            child: Text('$quantity', textAlign: TextAlign.center, style: context.text.titleSmall),
          ),
          // Step 3: plus.
          IconButton(tooltip: 'More', icon: const Icon(Icons.add), onPressed: () => onChanged(quantity + 1)),
        ],
      ),
    );
  }
}
