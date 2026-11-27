// Booking Status: where the booking is (the four-step tracker), a line about
// what happens next, and the receipt under it. Reads the latest booking from
// My bookings, so a change made since the receipt shows here.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/day_key.dart';
import '../../layout/igongo_scaffold.dart';
import '../../theme/theme.dart';
import '../application/bookings_providers.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/booking_timeline.dart';
import 'booking_status_steps.dart';
import 'booking_ticket_card.dart';

/// The status of one booking, with its receipt.
class BookingStatusScreen extends ConsumerWidget {
  /// Creates the screen for [booking] at [place].
  const BookingStatusScreen({super.key, required this.booking, required this.place});

  /// The booking as last shown; replaced by the live one when it loads.
  final Booking booking;

  /// The booking module.
  final BookingPlace place;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    // Step 1: the newest copy of this booking, else the one passed in.
    final list = ref.watch(myBookingsProvider(place)).valueOrNull ?? const <Booking>[];
    final b = _latest(list, booking);
    final today = dayOnly(DateTime.now());
    return IgongoScaffold(
      title: 'Booking status',
      body: ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [
          Text(b.offeringName, style: context.text.titleLarge),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the tracker, then what it means now.
          BookingStatusSteps(completed: completedSteps(b, today)),
          const SizedBox(height: IgongoSpace.lg),
          Text(_message(b, today), style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: the receipt, under the status.
          BookingTicketCard(booking: b, place: place),
        ],
      ),
    );
  }

  /// The booking with the same ID in [list], or [fallback] when it is not there.
  static Booking _latest(List<Booking> list, Booking fallback) {
    for (final b in list) {
      if (b.id == fallback.id) return b;
    }
    return fallback;
  }

  /// One line of what happens next, by status.
  static String _message(Booking b, DateTime today) {
    switch (b.status) {
      case 'cancelled':
        return 'This booking was cancelled.';
      case 'requested':
        return 'Your request is with our team. We will confirm it soon.';
      case 'awaiting_payment':
        return 'Payment is still owed. Pay from My bookings to confirm.';
      case 'confirmed':
        return 'Your booking is confirmed. We are getting everything ready.';
      case 'checked_in':
        return completedSteps(b, today) == 4 ? 'Thank you for staying with us.' : 'Welcome. Enjoy your stay.';
      default:
        return 'Your booking is on record.';
    }
  }
}
