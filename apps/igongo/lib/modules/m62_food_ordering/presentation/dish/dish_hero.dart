// The top of the dish page: the dish photo with its prep-time badge, and a soft
// fade at the bottom that melts into the page behind the overview card.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/photo_slot.dart';
import 'dish_badge.dart';

/// The photo at the top of the dish page.
class DishHero extends StatelessWidget {
  /// Creates the hero for a dish with [photoUrl] (null shows the placeholder) and [prepMinutes] (0 hides the badge).
  const DishHero({super.key, required this.photoUrl, required this.prepMinutes, required this.height});

  /// The dish photo's address, or null for the placeholder.
  final String? photoUrl;

  /// Minutes to prepare; the badge is hidden when zero.
  final int prepMinutes;

  /// The photo's height in logical pixels.
  final double height;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Step 1: the photo (or the placeholder box).
          PhotoSlot(width: double.infinity, height: height, asset: photoUrl, icon: Icons.restaurant_outlined),
          // Step 2: a soft fade from the photo into the page colour.
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            height: IgongoSpace.xxl * 2,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [palette.background.withValues(alpha: 0), palette.background],
                ),
              ),
            ),
          ),
          // Step 3: the prep-time badge, only when the menu has a time for this dish.
          if (prepMinutes > 0)
            Positioned(
              left: IgongoSpace.lg,
              bottom: IgongoSpace.lg,
              child: DishBadge(
                label: 'Prep: $prepMinutes mins',
                icon: Icons.schedule,
                background: palette.surface.withValues(alpha: 0.92),
                foreground: palette.text,
                border: palette.border,
              ),
            ),
        ],
      ),
    );
  }
}
