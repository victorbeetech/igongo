// The bar over the top of the dish page: Back on the left, the dish name
// (shown once the guest scrolls past the photo) in the middle, and the
// favourite and share buttons on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'dish_glass_button.dart';
import 'dish_glass_frame.dart';

/// The floating top bar. [titleShown] fades the dish name in.
class DishTopBar extends StatelessWidget {
  /// Creates the bar for the dish called [name].
  const DishTopBar({
    super.key,
    required this.name,
    required this.titleShown,
    required this.favourite,
    required this.onBack,
    required this.onToggleFavourite,
  });

  /// The dish name, shown in the middle once the photo has scrolled away.
  final String name;

  /// True once the guest has scrolled past the photo.
  final bool titleShown;

  /// True when the guest has marked the dish as a favourite.
  final bool favourite;

  /// Goes back to the menu.
  final VoidCallback onBack;

  /// Flips the favourite mark.
  final VoidCallback onToggleFavourite;

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
            // Step 3: favourite (a local mark) and share (not built yet, so disabled).
            DishGlassButton(
              icon: favourite ? Icons.favorite : Icons.favorite_border,
              tooltip: favourite ? 'Remove from favourites' : 'Add to favourites',
              color: favourite ? palette.primary : null,
              onPressed: onToggleFavourite,
            ),
            const SizedBox(width: IgongoSpace.sm),
            const DishGlassButton(icon: Icons.ios_share, tooltip: 'Share dish', onPressed: null),
          ],
        ),
      ),
    );
  }
}
