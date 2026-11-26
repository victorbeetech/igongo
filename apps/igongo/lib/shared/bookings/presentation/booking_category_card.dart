// One small card on the Bookings home: an icon in a red-tinted circle, and
// the name under it. The whole card is one tap target.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';
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
    return IgongoCard(
      onTap: onTap,
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        spacing: IgongoSpace.sm,
        children: [
          // Step 1: the icon in a tinted circle, in the brand red.
          CircleAvatar(
            backgroundColor: p.primaryContainer,
            child: Icon(category.icon, color: p.primaryText),
          ),
          // Step 2: the name, centred and kept to two lines.
          Text(
            category.label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: context.text.titleSmall,
          ),
        ],
      ),
    );
  }
}
