// Books a designed flow's choice: the main offering for its units, date and
// slot, then each extra (one unit each), then moves on as every booking does.
// Errors show as a toast and leave the guest's picks on screen.

import 'package:flutter/widgets.dart' show BuildContext;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../application/bookings_providers.dart';
import '../../../domain/booking_place.dart';
import '../../../domain/offering.dart';
import '../../booking_next.dart';
import '../../../../ui/toast/igongo_toast.dart';

/// Books [offering] for [units] on [date] (`YYYY-MM-DD`) and [slot], then each of [extras], then opens the next step.
Future<void> submitFlowBooking(
  BuildContext context,
  WidgetRef ref,
  BookingPlace place, {
  required Offering offering,
  required int units,
  String? date,
  String? slot,
  List<Offering> extras = const [],
}) async {
  try {
    // Step 1: the main booking, which the next step is for.
    final api = ref.read(bookingsApiProvider(place));
    final booking = await api.book(offeringId: offering.id, units: units, date: date, slot: slot);
    // Step 2: each extra, booked on its own so it has its own receipt.
    for (final extra in extras) {
      await api.book(offeringId: extra.id, units: 1);
    }
    // Step 3: the bookings list is stale now; reload it and move on.
    ref.invalidate(myBookingsProvider(place));
    if (context.mounted) await openAfterBooking(context, booking, place);
  } on Exception catch (e) {
    if (context.mounted) showIgongoToast(context, '$e');
  }
}
