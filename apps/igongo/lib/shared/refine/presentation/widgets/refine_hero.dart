// The hero card at the top of the filter: a photo of the place with its name and a title over a dark fade.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../../ui/photo/guest_photo.dart';
import '../../../ui/photo/guest_photos.dart';

/// The picture card with the place name and the title on it.
class RefineHero extends StatelessWidget {
  /// Creates the hero. [place] is the small word above the title; [title] is the big line.
  const RefineHero({super.key, required this.place, required this.title});

  /// The place name, shown in capitals above the title.
  final String place;

  /// The title, shown in the brand serif.
  final String title;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return ClipRRect(
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: SizedBox(
        height: 144,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Step 1: the photo, cropped to fill the card.
            GuestPhoto(asset: GuestPhotos.hotelCottages, label: title),
            // Step 2: a dark fade from the bottom so the words stay readable.
            // The fade stays dark in both modes, because the words on it are light in both.
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    IgongoColorsLight.brandInk.withValues(alpha: 0.75),
                    IgongoColorsLight.brandInk.withValues(alpha: 0.15),
                    Colors.transparent,
                  ],
                  stops: const [0, 0.45, 1],
                ),
              ),
              // Step 3: the place name and the title, sitting at the bottom of the card.
              child: Padding(
                padding: const EdgeInsets.all(IgongoSpace.lg),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      place.toUpperCase(),
                      style: context.text.labelSmall!.copyWith(
                        color: palette.accent,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.5,
                      ),
                    ),
                    Text(
                      title,
                      style: context.text.displaySmall!.copyWith(
                        color: palette.onPrimary,
                        fontWeight: FontWeight.w500,
                        fontSize: 22,
                        height: 1.15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
