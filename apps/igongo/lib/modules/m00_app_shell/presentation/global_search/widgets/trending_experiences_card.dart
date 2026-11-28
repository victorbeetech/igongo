// The "Trending Experiences" block: a title with "Popular this week", then one
// row per experience the super admin added. Each row opens its screen.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/hotel/domain/hotel_content_item.dart';
import '../../../../../shared/theme/theme.dart';

/// The trending block on the search screen.
class TrendingExperiencesCard extends StatelessWidget {
  /// Creates the block for [experiences]; [onOpen] runs with the row that was tapped.
  const TrendingExperiencesCard({super.key, required this.experiences, required this.onOpen});

  /// The experiences to list, in the admin's order.
  final List<HotelContentItem> experiences;

  /// Called with the tapped experience.
  final void Function(HotelContentItem experience) onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xl),
      child: DecoratedBox(
        decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step 1: the title with its fire icon, and "Popular this week" on the right.
              Row(
                children: [
                  Icon(Icons.local_fire_department, size: IgongoSpace.lg + IgongoSpace.xxs, color: p.primary),
                  const SizedBox(width: IgongoSpace.sm),
                  Expanded(child: Text('Trending Experiences', style: context.text.titleLarge)),
                  const SizedBox(width: IgongoSpace.sm),
                  Text(
                    'Popular this week',
                    style: context.text.labelSmall?.copyWith(color: p.warning, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
              const SizedBox(height: IgongoSpace.md),
              // Step 2: no experiences yet, so say so; otherwise one row per experience.
              if (experiences.isEmpty)
                Text('Nothing trending yet.', style: context.text.bodyMedium?.copyWith(color: p.textMuted))
              else
                for (final experience in experiences)
                  Padding(
                    padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
                    child: _ExperienceRow(experience: experience, onOpen: () => onOpen(experience)),
                  ),
            ],
          ),
        ),
      ),
    );
  }
}

/// One experience: its icon tile, name and subtitle, and an arrow on the right. The whole row is tappable.
class _ExperienceRow extends StatelessWidget {
  const _ExperienceRow({required this.experience, required this.onOpen});

  /// The experience to show.
  final HotelContentItem experience;

  /// Called when the row is tapped.
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Material(
      color: p.surface,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        onTap: onOpen,
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.md),
          child: Row(
            children: [
              // Step 1: the icon tile, the same for every experience.
              DecoratedBox(
                decoration: BoxDecoration(color: p.primaryContainer, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
                child: SizedBox(
                  width: IgongoTouch.minimum - IgongoSpace.xs,
                  height: IgongoTouch.minimum - IgongoSpace.xs,
                  child: Icon(Icons.auto_awesome_outlined, size: IgongoSpace.xl - IgongoSpace.xs, color: p.primary),
                ),
              ),
              const SizedBox(width: IgongoSpace.md),
              // Step 2: the name and the subtitle from the admin.
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(experience.title, style: context.text.labelLarge),
                    if (experience.subtitle.isNotEmpty) Text(experience.subtitle, style: context.text.bodySmall),
                  ],
                ),
              ),
              // Step 3: the arrow that says the row opens.
              Icon(Icons.chevron_right, color: p.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
