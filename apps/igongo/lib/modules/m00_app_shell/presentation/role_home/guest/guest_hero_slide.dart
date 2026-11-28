// One slide of the hero carousel: the picture (or a placeholder), a dark gradient for
// the text, the tag and bookmark on top, the title and price at the bottom, and a Book a room button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';
import '../../../../../shared/home_content/domain/home_hero_slide.dart';

/// One featured stay as a full-size slide. [onBook] opens the room list.
class GuestHeroSlide extends StatelessWidget {
  /// Creates the slide for [slide].
  const GuestHeroSlide({super.key, required this.slide, required this.onBook});

  /// The words and picture shown on this slide.
  final HomeHeroSlide slide;

  /// Called when the Book a room button is tapped.
  final VoidCallback onBook;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Stack(
      fit: StackFit.expand,
      children: [
        // Step 1: the slide's picture (a placeholder if none is set or it cannot load).
        GuestPhoto(imageUrl: slide.imageUrl, label: slide.title),
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
                    slide.tag,
                    style: context.text.labelSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const Spacer(),
              // The bookmark does nothing until saving is wired.
              IconButton.filled(
                tooltip: 'Save',
                onPressed: () {},
                style: IconButton.styleFrom(backgroundColor: p.primaryDark, foregroundColor: p.onPrimary),
                icon: const Icon(Icons.bookmark_border, size: IgongoSpace.lg),
              ),
            ],
          ),
        ),
        // Step 4: the eyebrow, title, description, price and the Book a room button at the bottom.
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
                    slide.eyebrow,
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
                slide.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: context.text.titleMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: IgongoSpace.xxs),
              Text(
                slide.description,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: context.text.bodySmall?.copyWith(color: p.onPrimary),
              ),
              const SizedBox(height: IgongoSpace.sm),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      slide.price,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.labelMedium?.copyWith(color: p.onPrimary),
                    ),
                  ),
                  FilledButton(
                    onPressed: onBook,
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
