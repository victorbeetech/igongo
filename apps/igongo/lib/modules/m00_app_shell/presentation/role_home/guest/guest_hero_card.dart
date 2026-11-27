// The hero card on the guest home: one large featured stay with a placeholder
// picture, a dark gradient for legible text, a title, the starting price and a
// "Book" button. Text is a placeholder until the hotel's real stay is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// The featured stay card. [onBook] opens the room list.
class GuestHeroCard extends StatelessWidget {
  /// Creates the card.
  const GuestHeroCard({super.key, required this.onBook});

  /// Called when the Book button is tapped.
  final VoidCallback onBook;

  /// The card's height in logical pixels.
  static const _height = 220.0;

  /// The corner radius: the design's large round corners, from the spacing scale.
  static const _radius = IgongoSpace.xl;

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
              // Step 3: the featured tag at the top left.
              Positioned(
                top: IgongoSpace.md,
                left: IgongoSpace.md,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: p.primary,
                    borderRadius: BorderRadius.circular(IgongoRadius.pill),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                    child: Text(
                      'Featured stay',
                      style: context.text.labelSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ),
              // Step 4: the title, the starting price and the Book button at the bottom.
              Positioned(
                left: IgongoSpace.md,
                right: IgongoSpace.md,
                bottom: IgongoSpace.md,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Stay details coming soon',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.titleMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: IgongoSpace.xs),
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
                          style: FilledButton.styleFrom(
                            backgroundColor: p.onPrimary,
                            foregroundColor: p.primaryText,
                          ),
                          child: Text('Book', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
                        ),
                      ],
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
