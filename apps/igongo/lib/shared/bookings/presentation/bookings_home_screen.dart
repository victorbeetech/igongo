// The Bookings home (the Bookings tab): a big picture slideshow, the guest's
// next stay, nine tiles three across, three shortcuts and the recent bookings.
// It has no app bar: the slideshow fills the top, like the guest home.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../format/day_key.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_categories.dart';
import '../domain/booking_place.dart';
import 'booking_category_card.dart';
import 'booking_hero.dart';
import 'booking_shortcuts.dart';
import 'next_stay_card.dart';
import 'recent_bookings.dart';

/// The Bookings home for [screen]; [rooms] is where the stays live in the API.
class BookingsHomeScreen extends ConsumerWidget {
  /// Creates the home; tiles open their screens through `screen.open`.
  const BookingsHomeScreen(this.screen, this.rooms, {super.key});

  /// The screen's context, for opening the tiles and My bookings.
  final ScreenContext screen;

  /// The room booking place (the next stay and recent bookings come from it).
  final BookingPlace rooms;

  /// The number of the My bookings screen.
  static const _myBookingsId = 'S67-06';

  /// The number of the My receipts screen.
  static const _receiptsId = 'S78-06';

  /// The room booking screen.
  static const _bookRoomId = 'S67-02';

  /// The guest's next stay: the soonest booking from today on that is not cancelled.
  static Booking? nextStay(List<Booking> all, DateTime today) {
    final from = dayKey(today);
    final upcoming = [
      for (final b in all)
        if (b.status != 'cancelled' && (b.date ?? '').compareTo(from) >= 0) b,
    ]..sort((a, b) => (a.date ?? '').compareTo(b.date ?? ''));
    return upcoming.firstOrNull;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Signed out or still loading: the sections just show their empty states.
    final all = ref.watch(myBookingsProvider(rooms)).valueOrNull ?? const <Booking>[];
    final recent = [...all]..sort((a, b) => (b.date ?? '').compareTo(a.date ?? ''));
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        // Step 1: the slideshow at the top.
        const BookingHero(),
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.lg,
            children: [
              // Step 2: the next stay.
              NextStayCard(
                stay: nextStay(all, DateTime.now()),
                onView: () => screen.open(_myBookingsId),
                onBook: () => screen.open(_bookRoomId),
              ),
              // Step 3: nine tiles, three across, all the same size.
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: IgongoSpace.sm,
                mainAxisSpacing: IgongoSpace.sm,
                children: [
                  for (final c in bookingCategories)
                    BookingCategoryCard(category: c, onTap: () => screen.open(c.screenId)),
                ],
              ),
              // Step 4: the three shortcuts.
              BookingShortcuts(
                onHistory: () => screen.open(_myBookingsId),
                onReceipts: () => screen.open(_receiptsId),
                onPastVisits: () => screen.open(_myBookingsId),
              ),
              // Step 5: the recent bookings.
              RecentBookings(bookings: recent, onOpen: () => screen.open(_myBookingsId)),
            ],
          ),
        ),
      ],
    );
  }
}
