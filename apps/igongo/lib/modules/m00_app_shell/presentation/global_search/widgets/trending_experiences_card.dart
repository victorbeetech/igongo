// The "Trending Experiences" block: a title with "Popular this week", then a row
// per experience with its icon tile and a price pill. Colours come from the tokens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../domain/trending_experience.dart';
import '../../../domain/trending_tone.dart';

/// The trending block on the search screen.
class TrendingExperiencesCard extends StatelessWidget {
  /// Creates the block for [experiences].
  const TrendingExperiencesCard({super.key, required this.experiences});

  /// The experiences to list, in order.
  final List<TrendingExperience> experiences;

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
              // Step 2: one row per experience.
              for (final experience in experiences)
                Padding(
                  padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
                  child: _ExperienceRow(experience: experience),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// One experience: its icon tile, name and subtitle, and the price pill on the right.
class _ExperienceRow extends StatelessWidget {
  const _ExperienceRow({required this.experience});

  /// The experience to show.
  final TrendingExperience experience;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the icon and the colours for this tone.
    final (IconData icon, Color tile, Color ink) = switch (experience.tone) {
      TrendingTone.heritage => (Icons.auto_stories, p.warmCard, p.warning),
      TrendingTone.culinary => (Icons.soup_kitchen, p.primaryContainer, p.primary),
      TrendingTone.wellness => (Icons.spa, p.background, p.text),
    };
    return DecoratedBox(
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Padding(
        padding: const EdgeInsets.all(IgongoSpace.md),
        child: Row(
          children: [
            // Step 2: the icon tile.
            DecoratedBox(
              decoration: BoxDecoration(color: tile, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
              child: SizedBox(
                width: IgongoTouch.minimum - IgongoSpace.xs,
                height: IgongoTouch.minimum - IgongoSpace.xs,
                child: Icon(icon, size: IgongoSpace.xl - IgongoSpace.xs, color: ink),
              ),
            ),
            const SizedBox(width: IgongoSpace.md),
            // Step 3: the name and subtitle.
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(experience.title, style: context.text.labelLarge),
                  Text(experience.subtitle, style: context.text.bodySmall),
                ],
              ),
            ),
            const SizedBox(width: IgongoSpace.sm),
            // Step 4: the price pill on the right.
            DecoratedBox(
              decoration: BoxDecoration(color: tile, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                child: Text(
                  ugx(experience.price),
                  style: context.text.labelSmall?.copyWith(color: ink, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
