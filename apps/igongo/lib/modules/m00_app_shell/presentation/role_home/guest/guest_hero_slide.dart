// One slide of the hero carousel, filled from a banner the super admin set: the
// picture (or the placeholder fill), a dark gradient for the text, the tag and
// bookmark on top, the title and subtitle at the bottom, and a button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';
import '../../../../../shared/hotel/domain/hotel_content_item.dart';

/// The small tag and the eyebrow line the slides share (words only, the design's labels).
const _tagLabel = 'Featured';
const _eyebrowLabel = 'HOTEL NEWS';

/// One banner as a full-size slide.
class GuestHeroSlide extends StatelessWidget {
  /// Creates the slide for [banner]. [onTap] runs the button.
  const GuestHeroSlide({super.key, required this.banner, required this.onTap});

  /// The admin's banner shown on this slide.
  final HotelContentItem banner;

  /// Called when the slide's button is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Stack(
      fit: StackFit.expand,
      children: [
        // Step 1: the banner's picture is not wired yet, so the shared placeholder shows.
        GuestPhoto(label: banner.title),
        // Step 2: a dark gradient from the bottom, so the text reads on any picture.
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [p.primaryDark.withValues(alpha: 0), p.primaryDark.withValues(alpha: 0.9)],
            ),
          ),
        ),
        // Step 3: the tag at the top left and the bookmark at the top right.
        Positioned(
          top: IgongoSpace.md,
          left: IgongoSpace.md,
          right: IgongoSpace.md,
          child: Row(
            children: [
              DecoratedBox(
                decoration: BoxDecoration(color: p.primary, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                  child: Text(
                    _tagLabel,
                    style: context.text.labelSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const Spacer(),
              // Step 3a: the bookmark is not part of the banner contract yet, so it is shown disabled.
              IconButton.filled(
                tooltip: 'Save',
                onPressed: null,
                style: IconButton.styleFrom(backgroundColor: p.primaryDark, foregroundColor: p.onPrimary),
                icon: const Icon(Icons.bookmark_border, size: IgongoSpace.lg),
              ),
            ],
          ),
        ),
        // Step 4: the eyebrow, title, subtitle and the button at the bottom.
        Positioned(
          left: IgongoSpace.md,
          right: IgongoSpace.md,
          bottom: IgongoSpace.xl,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.star_outline, size: IgongoSpace.md, color: p.onPrimary),
                  const SizedBox(width: IgongoSpace.xxs),
                  Text(
                    _eyebrowLabel,
                    style: context.text.labelSmall?.copyWith(
                      color: p.onPrimary,
                      letterSpacing: 1.1,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: IgongoSpace.xxs),
              Text(
                banner.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: context.text.titleMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: IgongoSpace.xxs),
              Text(
                banner.subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: context.text.bodySmall?.copyWith(color: p.onPrimary),
              ),
              const SizedBox(height: IgongoSpace.sm),
              Row(
                children: [
                  const Spacer(),
                  FilledButton(
                    onPressed: onTap,
                    // Step 4a: a light button with the Igongo red words; red on light reads in both modes.
                    style: FilledButton.styleFrom(backgroundColor: p.onPrimary, foregroundColor: p.primary),
                    child: Text('Book a room', style: context.text.labelLarge?.copyWith(color: p.primary, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
