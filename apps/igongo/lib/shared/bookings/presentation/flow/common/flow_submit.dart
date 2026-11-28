// Books a designed flow's choice: each line is an offering with the units to
// book. The first line is the main booking (the next step is for it); the rest
// are booked on their own so each has its own receipt. Then the guest moves on
// as every booking does. Errors show as a toast and keep the guest's picks.

import 'package:flutter/widgets.dart' show BuildContext;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../ui/toast/igongo_toast.dart';
import '../../../application/bookings_providers.dart';
import '../../../domain/booking_place.dart';
import '../../../domain/offering.dart';
import '../../booking_next.dart';

/// One line of a designed flow's choice: an offering and how many units to book.
typedef FlowLine = ({Offering offering, int units});

/// Books each line in [lines] (only those with units), on [date] (`YYYY-MM-DD`) and [slot] for the first,
/// then opens the next step for the first line's booking.
Future<void> submitFlowBooking(
  BuildContext context,
  WidgetRef ref,
  BookingPlace place, {
  required List<FlowLine> lines,
  String? date,
  String? slot,
  String? notes,
}) async {
  // Step 1: keep only the lines with units; the first of them is the main booking.
  final booked = lines.where((l) => l.units > 0).toList();
  if (booked.isEmpty) return showIgongoToast(context, 'Pick at least one ticket.');
  try {
    final api = ref.read(bookingsApiProvider(place));
    // Step 2: the main booking, on the day and slot picked.
    final main = booked.first;
    final booking = await api.book(offeringId: main.offering.id, units: main.units, date: date, slot: slot, notes: notes);
    // Step 3: the other lines, each its own booking.
    for (final line in booked.skip(1)) {
      await api.book(offeringId: line.offering.id, units: line.units);
    }
    // Step 4: the bookings list is stale now; reload it and move on.
    ref.invalidate(myBookingsProvider(place));
    if (context.mounted) await openAfterBooking(context, booking, place);
  } on Exception catch (e) {
    if (context.mounted) showIgongoToast(context, '$e');
  }
}
