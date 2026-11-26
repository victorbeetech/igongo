// The Bookings home (the Bookings tab): a short line, then four small cards
// in a grid (book a room, a table, events, spa) so one person sees every
// option without scrolling far. "My bookings" sits at the top right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../layout/igongo_scaffold.dart';
import '../../theme/theme.dart';
import '../domain/booking_categories.dart';
import 'booking_category_card.dart';

/// The Bookings home for [screen].
class BookingsHomeScreen extends StatelessWidget {
  /// Creates the home; tiles open their screens through `screen.open`.
  const BookingsHomeScreen(this.screen, {super.key});

  /// The screen's context, for opening the tiles and My bookings.
  final ScreenContext screen;

  /// The number of the My bookings screen.
  static const _myBookingsId = 'S67-06';

  @override
  Widget build(BuildContext context) => IgongoScaffold(
    title: 'Bookings',
    actions: [TextButton(onPressed: () => screen.open(_myBookingsId), child: const Text('My bookings'))],
    body: ListView(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      children: [
        // Step 1: the line above the cards.
        Text('Book a stay or an experience', style: context.text.headlineSmall),
        const SizedBox(height: IgongoSpace.xs),
        Text(
          'Find and book rooms, tables, events and more.',
          style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted),
        ),
        const SizedBox(height: IgongoSpace.lg),
        // Step 2: the four cards, two across. Their height is fixed, so the grid never scrolls on its own.
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: IgongoSpace.md,
          mainAxisSpacing: IgongoSpace.md,
          childAspectRatio: 1.3,
          children: [
            for (final c in bookingCategories) BookingCategoryCard(category: c, onTap: () => screen.open(c.screenId)),
          ],
        ),
      ],
    ),
  );
}
