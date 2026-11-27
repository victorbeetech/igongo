// "Happening today at Igongo": a title with a live dot, then a row of story
// bubbles that slides sideways. The bubbles are demo items until the hotel adds its events.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import 'guest_story_bubble.dart';

/// The stories row: the title and the bubbles, scrolling sideways.
class GuestStoriesRow extends StatelessWidget {
  /// Creates the row.
  const GuestStoriesRow({super.key});

  /// The demo bubbles: each has an icon, a demo title and its time. They are sample
  /// text only, to show the slide; the hotel's real events replace them later.
  static const _demoStories = <({IconData icon, String label})>[
    (icon: Icons.sunny, label: 'Sunrise walk'),
    (icon: Icons.pool_outlined, label: 'Pool party'),
    (icon: Icons.restaurant_outlined, label: 'Chef\'s table'),
    (icon: Icons.terrain_outlined, label: 'Guided hike'),
    (icon: Icons.music_note_outlined, label: 'Live music'),
    (icon: Icons.local_bar_outlined, label: 'Happy hour'),
    (icon: Icons.spa_outlined, label: 'Spa offer'),
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
            itemCount: _demoStories.length,
            separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
            itemBuilder: (_, i) => GuestStoryBubble(icon: _demoStories[i].icon, label: _demoStories[i].label),
          ),
        ),
      ],
    );
  }
}
