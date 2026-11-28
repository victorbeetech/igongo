// Where a guest goes right after a booking is made: a request (sent, nothing
// owed), a receipt (nothing owed), or payment (money owed). Shared by every
// booking screen so each one moves on the same way.

import 'package:material_ui/material_ui.dart';

import '../../ui/toast/igongo_toast.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import 'booking_confirmed_screen.dart';
import 'booking_payment_screen.dart';

/// Opens the next step for [booking], replacing the screen that made it (or popping it for a request).
Future<void> openAfterBooking(BuildContext context, Booking booking, BookingPlace place) async {
  final nav = Navigator.of(context);
  // Step 1: a request (an enquiry or an approval) owes nothing now; say so and go back.
  if (booking.status == 'requested') {
    showIgongoToast(context, 'Request sent');
    nav.pop();
    return;
  }
  // Step 2: nothing to pay, so the receipt is ready at once.
  if (booking.owed <= 0) {
    await nav.pushReplacement(MaterialPageRoute<void>(builder: (_) => BookingConfirmedScreen(booking: booking, place: place)));
    return;
  }
  // Step 3: money is owed, so the payment screen opens next.
  await nav.pushReplacement(MaterialPageRoute<void>(builder: (_) => BookingPaymentScreen(booking: booking, place: place)));
}
