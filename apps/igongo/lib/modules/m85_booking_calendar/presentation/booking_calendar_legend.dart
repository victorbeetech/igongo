// The legend under the calendar grid: what each status word and colour means.
// Every status also has its word, so colour is never the only clue.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';

/// A row of the three status names, each with its dot.
class BookingCalendarLegend extends StatelessWidget {
  /// Creates the legend.
  const BookingCalendarLegend({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Wrap(
      spacing: IgongoSpace.md,
      runSpacing: IgongoSpace.xs,
      children: [
        _Item(colour: p.success, label: 'Open'),
        _Item(colour: p.error, label: 'Spots full'),
        _Item(colour: p.textMuted, label: 'Closed'),
      ],
    );
  }
}

/// One legend entry: a dot and its word.
class _Item extends StatelessWidget {
  /// Creates an entry.
  const _Item({required this.colour, required this.label});

  /// The dot's colour.
  final Color colour;

  /// The word beside the dot.
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // The dot is decorative: the word next to it carries the meaning.
        ExcludeSemantics(child: CircleAvatar(radius: 5, backgroundColor: colour)),
        const SizedBox(width: IgongoSpace.xs),
        Text(label, style: context.text.labelMedium),
      ],
    );
  }
}
