// One Resort Experiences tile: a picture with a small badge chip on top, then
// the name with its icon, a short line, and a price row. The price is a
// placeholder until the API sends it. The whole tile is one tap target; a tile
// with no screen is not tappable.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/photo/photo_slot.dart';
import '../../domain/placeholder_copy.dart';
import '../../domain/resort_experience.dart';

/// A resort experience tile.
class ExperienceTile extends StatelessWidget {
  /// Creates the tile for [experience]; [onTap] is null when it has no screen yet.
  const ExperienceTile({super.key, required this.experience, this.onTap});

  /// What the tile shows.
  final ResortExperience experience;

  /// Opens the experience's screen, or null for no tap action.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.md + 4);
    // The tile is one screen-reader node: its name, and the button role when tappable.
    return Semantics(
      button: onTap != null,
      label: experience.label,
      excludeSemantics: true,
      child: DecoratedBox(
        // Step 1: a soft shadow and a fine warm border, as on the reference cards.
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: radius,
          border: Border.all(color: p.border),
          boxShadow: [BoxShadow(color: p.text.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, 4))],
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: radius,
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 2: the picture with its badge chip, or the placeholder until the hotel sends one.
                Expanded(
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      PhotoSlot(
                        width: double.infinity,
                        height: double.infinity,
                        asset: experience.photo,
                        icon: experience.icon,
                      ),
                      if (experience.badge != null)
                        Positioned(
                          top: IgongoSpace.sm,
                          left: IgongoSpace.sm,
                          child: _Badge(text: experience.badge!),
                        ),
                    ],
                  ),
                ),
                // Step 3: the name with its icon, and the short line under it.
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.sm, IgongoSpace.sm, IgongoSpace.sm, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        spacing: IgongoSpace.xs,
                        children: [
                          Icon(experience.icon, size: 18, color: p.primaryText),
                          Expanded(
                            child: Text(
                              experience.label,
                              style: context.text.titleSmall,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        experience.caption,
                        style: context.text.bodySmall?.copyWith(color: p.textMuted),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                // Step 4: the price row (placeholder text until the API sends prices).
                Padding(
                  padding: const EdgeInsets.fromLTRB(IgongoSpace.sm, IgongoSpace.xs, IgongoSpace.sm, IgongoSpace.sm),
                  child: Row(
                    children: [
                      Text(experience.priceLabel, style: context.text.bodySmall?.copyWith(color: p.textMuted)),
                      const SizedBox(width: IgongoSpace.xs),
                      Expanded(
                        child: Text(
                          pricePlaceholder,
                          style: context.text.labelMedium?.copyWith(color: p.primaryText),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.end,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// The small chip on a tile's picture (for example `Chalet Stay`).
class _Badge extends StatelessWidget {
  /// Creates the chip with [text].
  const _Badge({required this.text});

  /// The words on the chip.
  final String text;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        // Nearly opaque surface behind the words, so they read over any picture.
        color: p.surface.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(IgongoRadius.sm),
      ),
      child: Text(text, style: context.text.labelSmall?.copyWith(color: p.primaryText), maxLines: 1),
    );
  }
}
