// One tile on the Bookings home: a picture filling the tile and a cream disc
// with a red icon in the middle, as on the reference (the name is read aloud by
// screen readers). The whole tile is one tap target. Without a photo the tile shows the plain placeholder.

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
            ],
          ),
        ),
      ),
    );
  }
}
