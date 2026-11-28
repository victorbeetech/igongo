// The photo header of a booking-flow screen: the hotel photo with a dark
// fade at the bottom, a badge at the top left, and the title and location
// over the fade.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/photo/guest_photo.dart';

/// The hero block for an experience, room or service.
class FlowHero extends StatelessWidget {
  /// Creates the hero with [photo] and text over it.
  const FlowHero({
    super.key,
    required this.photo,
    required this.title,
    this.kicker,
    this.detail,
    this.badge,
    this.trailingBadge,
    this.height = 240,
  });

  /// Asset path of the photo (a sample image already in the app).
  final String photo;

  /// The large title over the photo, in the brand serif.
  final String title;

  /// Small uppercase line above the title, for example the venue name.
  final String? kicker;

  /// Line under the title with the location or a short note.
  final String? detail;

  /// Badge at the top left, for example the rating or "Heritage Sanctuary".
  final Widget? badge;

  /// Badge at the top right, for example "From UGX —".
  final Widget? trailingBadge;

  /// Height of the photo block.
  final double height;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the photo, then a dark gradient for the text to sit on.
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          GuestPhoto(asset: photo, label: title),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0x00000000), Color(0xCC1A1210)],
                stops: [0.35, 1],
              ),
            ),
          ),
          // Step 2: the badges across the top.
          if (badge != null || trailingBadge != null)
            Positioned(
              top: IgongoSpace.md,
              left: IgongoSpace.md,
              right: IgongoSpace.md,
              child: Row(
                children: [
                  ?badge,
                  const Spacer(),
                  ?trailingBadge,
                ],
              ),
            ),
          // Step 3: the kicker, title and detail at the bottom, in white.
          Positioned(
            left: IgongoSpace.lg,
            right: IgongoSpace.lg,
            bottom: IgongoSpace.lg,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (kicker != null)
                  Text(
                    kicker!.toUpperCase(),
                    style: context.text.labelSmall?.copyWith(color: palette.accent, letterSpacing: 1.2),
                  ),
                Text(
                  title,
                  style: context.text.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontFamily: IgongoFonts.brand,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                if (detail != null)
                  Text(detail!, style: context.text.bodySmall?.copyWith(color: Colors.white70)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
