// One dish card in the "From our kitchen" row: a placeholder picture with a tag, a
// rating and a prep-time pill on it, then the dish name, a short description, and the
// price with an add button. The name, description and price come from the menu API;
// the tag, rating and prep time are placeholders until the functionality is wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// A dish card. [onTap] is null for the placeholder cards, which open nothing.
class GuestDishCard extends StatelessWidget {
  /// Creates the card. [tag], [rating] and [prepTime] are placeholder words until wired.
  const GuestDishCard({
    super.key,
    required this.name,
    required this.description,
    required this.price,
    required this.tag,
    required this.rating,
    required this.prepTime,
    this.onTap,
  });

  /// The dish's name.
  final String name;

  /// A short description (may be empty).
  final String description;

  /// The price, already formatted, such as "UGX 45,000".
  final String price;

  /// The tag on the picture's top left, such as "Best seller".
  final String tag;

  /// The rating shown on the picture's bottom left, such as "4.9 (184)".
  final String rating;

  /// The prep time shown on the picture's bottom right, such as "25 mins".
  final String prepTime;

  /// Called when the card or its add button is tapped.
  final VoidCallback? onTap;

  /// The card's width and the picture's height, in logical pixels.
  static const _width = 260.0;
  static const _pictureHeight = 120.0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.lg);
    return SizedBox(
      width: _width,
      child: Material(
        color: p.surface,
        shape: RoundedRectangleBorder(borderRadius: radius, side: BorderSide(color: p.border)),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step 1: the placeholder picture with its tag, rating and prep time on top.
              Stack(
                children: [
                  const SizedBox(height: _pictureHeight, width: double.infinity, child: GuestPhoto()),
                  Positioned(top: IgongoSpace.sm, left: IgongoSpace.sm, child: _Pill(text: tag, fill: p.primary, ink: p.onPrimary)),
                  Positioned(
                    bottom: IgongoSpace.sm,
                    left: IgongoSpace.sm,
                    child: _Pill(text: rating, fill: p.surface, ink: p.text, icon: Icons.star, iconColor: p.warning),
                  ),
                  Positioned(
                    bottom: IgongoSpace.sm,
                    right: IgongoSpace.sm,
                    child: _Pill(text: prepTime, fill: p.text, ink: p.surface, icon: Icons.schedule),
                  ),
                ],
              ),
              // Step 2: the name and a short description.
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.md, IgongoSpace.sm, IgongoSpace.md, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.text.titleSmall?.copyWith(color: p.text, fontWeight: FontWeight.w700),
                    ),
                    if (description.isNotEmpty)
                      Text(
                        description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.bodySmall?.copyWith(color: p.textMuted),
                      ),
                  ],
                ),
              ),
              // Step 3: the price on the left, the add button on the right.
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.md),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        price,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.titleMedium?.copyWith(color: p.primaryText, fontWeight: FontWeight.w700),
                      ),
                    ),
                    IconButton.filled(
                      tooltip: 'Add $name',
                      onPressed: onTap,
                      style: IconButton.styleFrom(backgroundColor: p.primary, foregroundColor: p.onPrimary),
                      icon: const Icon(Icons.add),
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

/// A small rounded label on the dish picture, with an optional icon before its text.
class _Pill extends StatelessWidget {
  /// Creates the pill with its [text], fill and text colour [ink].
  const _Pill({required this.text, required this.fill, required this.ink, this.icon, this.iconColor});

  /// The words in the pill.
  final String text;

  /// The pill's background colour.
  final Color fill;

  /// The text (and icon) colour.
  final Color ink;

  /// An optional icon before the text.
  final IconData? icon;

  /// The icon's colour, when it should differ from [ink].
  final Color? iconColor;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: IgongoSpace.md, color: iconColor ?? ink),
            const SizedBox(width: IgongoSpace.xxs),
          ],
          Text(text, style: context.text.labelSmall?.copyWith(color: ink, fontWeight: FontWeight.w700)),
        ],
      ),
    ),
  );
}
