// The hero card on the guest home: one large featured stay with a placeholder picture,
// a dark gradient for legible text, a tag, a bookmark, an eyebrow line, the title, a
// description, the starting price, a "Book a room" button and carousel dots. The words
// are placeholders until the hotel's real stay is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// The featured stay card. [onBook] opens the room list.
class GuestHeroCard extends StatelessWidget {
  /// Creates the card.
  const GuestHeroCard({super.key, required this.onBook});

  /// Called when the Book a room button is tapped.
  final VoidCallback onBook;

  /// The card's height in logical pixels.
  static const _height = 240.0;

  /// The corner radius: the design's large round corners, from the spacing scale.
  static const _radius = IgongoSpace.xl;

  /// How many carousel dots show under the card (the first one is active).
  static const _dotCount = 3;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(_radius),
        child: SizedBox(
          height: _height,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Step 1: the placeholder picture fills the card.
              const GuestPhoto(),
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
                          'Featured stay',
                          style: context.text.labelSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                    const Spacer(),
                    // The bookmark is a placeholder: it does nothing until saving is wired.
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
                          'COMING SOON',
                          style: context.text.labelSmall?.copyWith(color: p.onPrimary, letterSpacing: 1.1, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                    const SizedBox(height: IgongoSpace.xxs),
                    Text(
                      'Stay details coming soon',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.titleMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: IgongoSpace.xxs),
                    Text(
                      'Description coming soon',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.bodySmall?.copyWith(color: p.onPrimary),
                    ),
                    const SizedBox(height: IgongoSpace.sm),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            'Starting from UGX — / night',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: context.text.labelMedium?.copyWith(color: p.onPrimary),
                          ),
                        ),
                        FilledButton(
                          onPressed: onBook,
                          style: FilledButton.styleFrom(backgroundColor: p.onPrimary, foregroundColor: p.primaryText),
                          child: Text('Book a room', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Step 5: the carousel dots at the very bottom, the first one active.
              Positioned(
                left: 0,
                right: 0,
                bottom: IgongoSpace.xs,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    for (var i = 0; i < _dotCount; i++)
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: IgongoSpace.xxs),
                        width: i == 0 ? IgongoSpace.lg : IgongoSpace.sm,
                        height: IgongoSpace.xxs,
                        decoration: BoxDecoration(
                          color: p.onPrimary.withValues(alpha: i == 0 ? 1 : 0.4),
                          borderRadius: BorderRadius.circular(IgongoRadius.pill),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
