// A small rounded label with a booking's status (for example "Confirmed"),
// in the ochre accent so it reads on the cream cards.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The status chip; [label] is the words to show.
class BookingStatusChip extends StatelessWidget {
  /// Creates the chip with [label].
  const BookingStatusChip({super.key, required this.label});

  /// The words on the chip.
  final String label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        // A pale ochre wash behind the accent words, so the chip stays readable in both modes.
        color: p.accent.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Text(
        label,
        style: context.text.labelMedium?.copyWith(color: p.text),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}
