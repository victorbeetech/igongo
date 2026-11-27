// One tile on the Bookings home: a picture filling the tile, a cream disc with
// a red icon in the middle and the name along the bottom. The whole tile is one
// tap target. Without a photo the tile shows the plain placeholder.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/photo/photo_slot.dart';
import '../domain/booking_category.dart';

/// A booking category tile.
class BookingCategoryCard extends StatelessWidget {
  /// Creates the tile for [category]; [onTap] opens it.
  const BookingCategoryCard({super.key, required this.category, required this.onTap});

  /// What the tile shows.
  final BookingCategory category;

  /// Opens the category's screen.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: category.label,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        child: InkWell(
          onTap: onTap,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Step 1: the picture (or placeholder).
              PhotoSlot(width: double.infinity, height: double.infinity, asset: category.photo, icon: category.icon),
              // Step 2: the cream disc with the red icon, in the middle.
              Center(
                child: CircleAvatar(
                  radius: 22,
                  backgroundColor: p.brandCream,
                  foregroundColor: p.primary,
                  child: Icon(category.icon),
                ),
              ),
              // Step 3: the name on a red strip along the bottom, kept to one line.
              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  width: double.infinity,
                  color: p.primary.withValues(alpha: 0.85),
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                  child: Text(
                    category.label,
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.text.labelSmall?.copyWith(color: p.onPrimary),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
