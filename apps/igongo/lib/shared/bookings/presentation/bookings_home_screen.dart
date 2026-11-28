// The Bookings home (the Bookings tab), laid out as the design: a title row, the
// picture slideshow, the active reservation card, pill tabs, the eight Resort
// Experiences tiles and "Your Itinerary & Bookings". Bookings come from the real
// API; the pictures are placeholders until the hotel sends them.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../format/day_key.dart';
import '../../theme/theme.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/resort_experiences.dart';
import '../domain/placeholder_copy.dart';
import 'booking_hero.dart';
import 'home/hero_chips.dart';
import 'home/active_reservation_card.dart';
import 'home/book_on_whatsapp_card.dart';
import 'home/booking_segment_tabs.dart';
import 'home/bookings_home_header.dart';
import 'home/itinerary_section.dart';
import 'home/resort_experiences_grid.dart';

/// The Bookings home for [screen]; [rooms] is where the stays live in the API.
class BookingsHomeScreen extends ConsumerWidget {
  /// Creates the home; tiles open their screens through `screen.open`.
  const BookingsHomeScreen(this.screen, this.rooms, {super.key});

  /// The screen's context, for opening the tiles and My bookings.
  final ScreenContext screen;

  /// The room booking place (the next stay and the bookings list come from it).
  final BookingPlace rooms;

  /// The number of the My bookings screen.
  static const _myBookingsId = 'S67-06';

  /// The number of the My receipts screen.
  static const _receiptsId = 'S78-06';

  /// The booking calendar (module 85, S85-01), opened from the calendar badge.
  static const _calendarId = 'S85-01';

  /// The room booking screen.

  /// The food ordering screen (used for Room Order).
  static const _foodId = 'S62-01';

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
    // Newest first for the itinerary list.
    final recent = [...all]..sort((a, b) => (b.date ?? '').compareTo(a.date ?? ''));
    final stay = nextStay(all, DateTime.now());
    return ColoredBox(
      // The warm cream page of the design (a theme token, dark in dark mode).
      color: context.palette.warmCream,
      child: Stack(
        children: [
          // Step 1: the page: the title row above the scrolling content.
          Column(
            children: [
              BookingsHomeHeader(onReceipts: () => screen.open(_receiptsId), onCalendar: () => screen.open(_calendarId)),
              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    // Step 2: the picture slideshow with its place and theme chips.
                    Stack(
                      children: [
                        const BookingHero(),
                        const Positioned(
                          top: IgongoSpace.md,
                          left: IgongoSpace.md,
                          child: HeroPlaceChip(text: heroPlaceName),
                        ),
                        const Positioned(
                          bottom: 72,
                          left: IgongoSpace.md,
                          child: HeroThemeChip(text: heroThemeLabel),
                        ),
                        // The headline sits over the picture, above the page dots, as on the design.
                        Positioned(
                          left: IgongoSpace.md,
                          right: IgongoSpace.md,
                          bottom: 36,
                          child: Text(
                            'Experience the Regal Spirit of Ankole',
                            style: context.text.headlineSmall?.copyWith(
                              color: context.palette.onPrimary,
                              shadows: [Shadow(color: context.palette.text.withValues(alpha: 0.5), blurRadius: 8)],
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(IgongoSpace.md),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: IgongoSpace.md,
                        children: [
                          // Step 3: the active reservation (the next stay) with its three actions.
                          // With no stay, a short WhatsApp call to action; with a stay, the card.
                          if (stay == null)
                            const BookOnWhatsappCard()
                          else
                            ActiveReservationCard(
                              stay: stay,
                              // The next stay comes from the room module, so it is a room.
                              isRoomStay: true,
                              onDigitalKey: () => screen.open(_myBookingsId),
                              onRoomOrder: () => screen.open(_foodId),
                              onManage: () => screen.open(_myBookingsId),
                              onEventDetails: () => screen.open(_myBookingsId),
                              onVenue: () => screen.open(_myBookingsId),
                            ),
                          // Step 4: the pill tabs.
                          BookingSegmentTabs(
                            activeCount: stay == null ? 0 : 1,
                            receiptCount: all.length,
                            open: screen.open,
                          ),
                          // Step 5: the eight resort experiences.
                          ResortExperiencesGrid(experiences: resortExperiences, open: screen.open),
                          // Step 6: the itinerary (the real bookings).
                          ItinerarySection(
                            bookings: recent,
                            onOpen: () => screen.open(_myBookingsId),
                            onReceipt: () => screen.open(_receiptsId),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
