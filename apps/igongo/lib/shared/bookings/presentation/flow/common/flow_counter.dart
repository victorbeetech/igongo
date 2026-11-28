// A quantity stepper: a minus button, the count, and a plus button. Used for
// visitor passes, swimmer passes, guests and room counts.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// A row with a label, a sub-label and a [value] stepper.
class FlowCounter extends StatelessWidget {
  /// Creates the stepper. [onChanged] receives the new count.
  const FlowCounter({
    super.key,
    required this.label,
    required this.value,
    required this.onChanged,
    this.detail,
    this.min = 0,
    this.max = 99,
  });

  /// The row label, for example "Adults (Standard)".
  final String label;

  /// Optional line under the label, for example the age range.
  final String? detail;

  /// The current count.
  final int value;

  /// Called with the new count when the guest taps + or -.
  final ValueChanged<int> onChanged;

  /// The lowest count allowed.
  final int min;

  /// The highest count allowed.
  final int max;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the label block on the left.
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: palette.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                if (detail != null)
                  Text(detail!, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
              ],
            ),
          ),
          // Step 2: minus, the count, and plus, each at least 40 pixels for touch.
          IconButton(
            tooltip: 'Remove one',
            icon: const Icon(Icons.remove),
            color: palette.text,
            onPressed: value > min ? () => onChanged(value - 1) : null,
          ),
          SizedBox(
            width: IgongoSpace.xl,
            child: Text(
              '$value',
              textAlign: TextAlign.center,
              style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
          ),
          IconButton.filled(
            tooltip: 'Add one',
            icon: const Icon(Icons.add),
            style: IconButton.styleFrom(backgroundColor: palette.primary, foregroundColor: palette.onPrimary),
            onPressed: value < max ? () => onChanged(value + 1) : null,
          ),
        ],
      ),
    );
  }
}
