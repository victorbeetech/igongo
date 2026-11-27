// One dish card in the "From our kitchen" row: a placeholder picture, the dish
// name, a short description, and the price with an add button. The name, description
// and price come from the menu API; the picture is a placeholder until the hotel sends it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';

/// A dish card. [onTap] is null for the placeholder cards, which open nothing.
class GuestDishCard extends StatelessWidget {
  /// Creates the card.
  const GuestDishCard({
    super.key,
    required this.name,
    required this.description,
    required this.price,
    this.onTap,
  });

  /// The dish's name.
  final String name;

  /// A short description (may be empty).
  final String description;

  /// The price, already formatted, such as "UGX 45,000".
  final String price;

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
              // Step 1: the placeholder picture across the top.
              const SizedBox(height: _pictureHeight, width: double.infinity, child: GuestPhoto()),
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
