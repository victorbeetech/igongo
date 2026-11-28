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
  const TrendingExperiencesCard({super.key, required this.experiences, required this.onOpen});

  /// Called with the index of the experience that was tapped.
  final void Function(int index) onOpen;

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
              // Step 2: one row per experience, or a short note while the admin has added none.
              if (experiences.isEmpty)
                Text('Nothing trending yet.', style: context.text.bodyMedium?.copyWith(color: p.textMuted))
              else
                for (var i = 0; i < experiences.length; i++)
                  Padding(
                    padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
                    child: _ExperienceRow(experience: experiences[i], onTap: () => onOpen(i)),
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
  const _ExperienceRow({required this.experience, required this.onTap});

  /// The experience to show.
  final TrendingExperience experience;

  /// Called when the row is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the icon and the colours for this tone.
    final (IconData icon, Color tile, Color ink) = switch (experience.tone) {
      null => (Icons.auto_awesome_outlined, p.primaryContainer, p.primary),
      TrendingTone.heritage => (Icons.auto_stories, p.warmCard, p.warning),
      TrendingTone.culinary => (Icons.soup_kitchen, p.primaryContainer, p.primary),
      TrendingTone.wellness => (Icons.spa, p.background, p.text),
    };
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: DecoratedBox(
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
                  experience.price == null ? '—' : ugx(experience.price!),
                  style: context.text.labelSmall?.copyWith(color: ink, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}
