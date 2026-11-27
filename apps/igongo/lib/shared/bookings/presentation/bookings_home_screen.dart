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
import 'home/whatsapp_button.dart';
import 'home/active_reservation_card.dart';
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

  /// The room booking screen.
  static const _bookRoomId = 'S67-02';

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
              BookingsHomeHeader(onReceipts: () => screen.open(_receiptsId)),
              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    // Step 2: the picture slideshow with its place and theme chips.
                    const Stack(
                      children: [
                        BookingHero(),
                        Positioned(
                          top: IgongoSpace.md,
                          left: IgongoSpace.md,
                          child: HeroPlaceChip(text: heroPlaceName),
                        ),
                        Positioned(
                          bottom: IgongoSpace.xl,
                          left: IgongoSpace.md,
                          child: HeroThemeChip(text: heroThemeLabel),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(IgongoSpace.md),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: IgongoSpace.md,
                        children: [
                          Text(
                            'Experience the Regal Spirit of Ankole',
                            style: context.text.headlineSmall?.copyWith(color: context.palette.primaryText),
                          ),
                          // Step 3: the active reservation (the next stay) with its three actions.
                          ActiveReservationCard(
                            stay: stay,
                            onDigitalKey: () => screen.open(_myBookingsId),
                            onRoomOrder: () => screen.open(_foodId),
                            onManage: () => screen.open(_myBookingsId),
                            onBook: () => screen.open(_bookRoomId),
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
          // Step 7: the WhatsApp button floats bottom right (no number yet, so no tap action).
          const Positioned(right: IgongoSpace.lg, bottom: IgongoSpace.lg, child: WhatsAppButton()),
        ],
      ),
    );
  }
}
