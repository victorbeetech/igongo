// "Happening today at Igongo": a title with a live dot, then a row of story
// bubbles. The bubbles are placeholders until the hotel adds its events.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import 'guest_story_bubble.dart';

/// The stories row: the title and the bubbles, scrolling sideways.
class GuestStoriesRow extends StatelessWidget {
  /// Creates the row.
  const GuestStoriesRow({super.key});

  /// The placeholder bubbles, each with its icon and label until real events exist.
  static const _placeholders = <({IconData icon, String label})>[
    (icon: Icons.play_arrow, label: 'Coming soon'),
    (icon: Icons.pets_outlined, label: 'Coming soon'),
    (icon: Icons.restaurant_outlined, label: 'Coming soon'),
    (icon: Icons.terrain_outlined, label: 'Coming soon'),
    (icon: Icons.pool_outlined, label: 'Coming soon'),
  ];

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Step 1: the title on the left, a green live dot and "Live updates" on the right.
        Padding(
          padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  'HAPPENING TODAY AT IGONGO',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.labelSmall?.copyWith(
                    color: p.textMuted,
                    letterSpacing: 1.1,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              DecoratedBox(
                decoration: BoxDecoration(color: p.success, shape: BoxShape.circle),
                child: const SizedBox(width: IgongoSpace.xs, height: IgongoSpace.xs),
              ),
              const SizedBox(width: IgongoSpace.xs),
              Text('Live updates', style: context.text.labelSmall?.copyWith(color: p.primaryText)),
            ],
          ),
        ),
        // Step 2: the bubbles in one row that scrolls sideways.
        SizedBox(
          height: 96,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            itemCount: _placeholders.length,
            separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
            itemBuilder: (_, i) => GuestStoryBubble(icon: _placeholders[i].icon, label: _placeholders[i].label),
          ),
        ),
      ],
    );
  }
}
