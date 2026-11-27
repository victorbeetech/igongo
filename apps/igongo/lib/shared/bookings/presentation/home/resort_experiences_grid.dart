// The Resort Experiences section: a heading, a short line, and the eight tiles
// in two columns. Each tile opens its screen when it has one.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/resort_experience.dart';
import 'experience_tile.dart';

/// The Resort Experiences grid. [open] receives a screen number to open.
class ResortExperiencesGrid extends StatelessWidget {
  /// Creates the section for [experiences], opening screens through [open].
  const ResortExperiencesGrid({super.key, required this.experiences, required this.open});

  /// The tiles, in order.
  final List<ResortExperience> experiences;

  /// Opens a screen by its number.
  final void Function(String screenId) open;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.sm,
      children: [
        // Step 1: the heading and its line.
        Text('Resort Experiences', style: context.text.headlineSmall?.copyWith(color: p.primaryText)),
        Text(
          'Handcrafted cultural & bespoke leisure services',
          style: context.text.bodySmall?.copyWith(color: p.textMuted),
        ),
        // Step 2: two columns of tiles; each tile is about 4:5 (a little taller than wide).
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: IgongoSpace.sm,
          mainAxisSpacing: IgongoSpace.sm,
          childAspectRatio: 0.8,
          children: [
            for (final e in experiences)
              ExperienceTile(experience: e, onTap: e.screenId == null ? null : () => open(e.screenId!)),
          ],
        ),
      ],
    );
  }
}
