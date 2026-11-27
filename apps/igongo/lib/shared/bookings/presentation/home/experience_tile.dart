// One Resort Experiences tile: a picture on top, then the name, a short line and
// the icon. The whole tile is one tap target; a tile with no screen is not tappable.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/photo/photo_slot.dart';
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
                // Step 2: the picture, or the placeholder until the hotel sends one.
                Expanded(
                  child: PhotoSlot(
                    width: double.infinity,
                    height: double.infinity,
                    asset: experience.photo,
                    icon: experience.icon,
                  ),
                ),
                // Step 3: the name with its icon, and the short line under it.
                Padding(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
