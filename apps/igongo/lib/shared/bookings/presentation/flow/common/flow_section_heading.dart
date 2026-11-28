// A section heading for the booking-flow screens: a small uppercase eyebrow
// ("STEP 1 • CURATED ITINERARY") with an optional note on the right, and the
// section title below it in the brand serif.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The eyebrow, title and optional meta line of one numbered section.
class FlowSectionHeading extends StatelessWidget {
  /// Creates a heading with [eyebrow] (small caps), [title] (serif) and [meta] (right side).
  const FlowSectionHeading({super.key, required this.eyebrow, required this.title, this.meta});

  /// The small uppercase line above the title, for example "Step 1 • Curated itinerary".
  final String eyebrow;

  /// The section title, shown in the brand serif.
  final String title;

  /// Optional note on the right of the eyebrow, for example "Daily Departures".
  final String? meta;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the eyebrow on the left and the optional note on the right.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                eyebrow.toUpperCase(),
                style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2),
              ),
            ),
            if (meta != null)
              Text(meta!, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
          ],
        ),
        const SizedBox(height: IgongoSpace.xxs),
        // Step 2: the section title in the brand serif, in the primary red.
        Text(
          title,
          style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand),
        ),
      ],
    );
  }
}
