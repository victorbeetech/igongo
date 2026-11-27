// The bar over the top of the dish page: Back on the left, the dish name
// (shown once the guest scrolls past the photo) in the middle, and the
// favourite and share buttons on the right. Favourite and share are shown
// but disabled until they are wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'dish_glass_button.dart';
import 'dish_glass_frame.dart';
import 'dish_placeholder.dart';

/// The floating top bar. [titleShown] fades the dish name in.
class DishTopBar extends StatelessWidget {
  /// Creates the bar for the dish called [name].
  const DishTopBar({super.key, required this.name, required this.titleShown, required this.onBack});

  /// The dish name, shown in the middle once the photo has scrolled away.
  final String name;

  /// True once the guest has scrolled past the photo.
  final bool titleShown;

  /// Goes back to the menu.
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
        child: Row(
          children: [
            // Step 1: Back.
            DishGlassFrame(
              child: BackButton(color: palette.text, onPressed: onBack),
            ),
            // Step 2: the name, faded in on scroll and cut short so it fits. It is built only
            // while shown, so the dish name is not on screen twice (the card has it too).
            Expanded(
              child: Center(
                child: AnimatedSwitcher(
                  duration: Duration(milliseconds: IgongoMotion.standard.round()),
                  child: titleShown
                      ? Container(
                          key: const ValueKey('dish-title'),
                          constraints: const BoxConstraints(maxWidth: 200),
                          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.xs),
                          decoration: BoxDecoration(
                            color: palette.surface.withValues(alpha: 0.95),
                            borderRadius: BorderRadius.circular(IgongoRadius.pill),
                            border: Border.all(color: palette.border),
                          ),
                          child: Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: context.text.labelLarge,
                          ),
                        )
                      : const SizedBox.shrink(key: ValueKey('dish-title-hidden')),
                ),
              ),
            ),
            // Step 3: favourite and share, shown but disabled until they are wired.
            const DishGlassButton(icon: Icons.favorite_border, tooltip: dishComingSoon),
            const SizedBox(width: IgongoSpace.sm),
            const DishGlassButton(icon: Icons.ios_share, tooltip: dishComingSoon),
          ],
        ),
      ),
    );
  }
}
