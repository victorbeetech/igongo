// The Resort Venues strip: a green live dot, the heading, the venue count, and
// the venues as an auto-sliding carousel (every 2.5 seconds) with the middle
// card highlighted.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'venue_carousel.dart';

/// The heading, and the auto-sliding carousel of venue cards.
class VenueRow extends StatelessWidget {
  /// Creates the strip for [itemCount] venues, each built by [itemBuilder].
  const VenueRow({super.key, required this.itemCount, required this.itemBuilder});

  /// How many venues there are.
  final int itemCount;

  /// Builds one venue card; [highlighted] is true for the card in the middle.
  final VenueItemBuilder itemBuilder;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    final n = itemCount;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Step 1: the heading with a live dot on the left and the count on the right.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: p.success, shape: BoxShape.circle),
              ),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(
                child: Text(
                  'RESORT VENUES',
                  style: text.labelMedium?.copyWith(fontWeight: FontWeight.w700, color: p.primaryText),
                ),
              ),
              Text('$n ${n == 1 ? 'venue' : 'venues'}', style: text.bodySmall?.copyWith(color: p.textMuted)),
            ],
          ),
        ),
        const SizedBox(height: IgongoSpace.sm),
        // Step 2: the auto-sliding cards.
        SizedBox(
          height: 170,
          child: VenueCarousel(itemCount: n, itemBuilder: itemBuilder),
        ),
      ],
    );
  }
}
