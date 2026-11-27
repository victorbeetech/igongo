// The Resort Venues strip: a green live dot, the heading, the venue count, and
// the venue cards side by side (scrolling sideways).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The heading and the sideways row of venue cards.
class VenueRow extends StatelessWidget {
  /// Creates the strip with the venue [children] (one card each).
  const VenueRow({super.key, required this.children});

  /// The venue cards, left to right.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    final n = children.length;
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
        // Step 2: the cards, sideways.
        SizedBox(
          height: 170,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            itemCount: n,
            separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
            itemBuilder: (_, i) => children[i],
          ),
        ),
      ],
    );
  }
}
