// Supplies the guest's receipts to the My receipts screen and the Receipt
// Detail ticket. Reads the person's succeeded payments, then the booking
// records behind any booking payments, and maps each with receiptFromPayment.
// It reloads when the session changes, so a sign-out or a new sign-in never
// shows the previous person's receipts.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/receipts_api.dart';
import '../domain/guest_receipt.dart';
import 'payment_receipt_mapper.dart';

/// The receipts calls on the app's client.
final receiptsApiProvider = Provider((ref) => ReceiptsApi(ref.watch(apiClientProvider)));

/// The person's receipts, newest first. An empty list shows the empty state.
final myReceiptsProvider = FutureProvider.autoDispose<List<GuestReceipt>>((ref) async {
  // Step 1: depend on the session, so the list reloads after sign-in or sign-out.
  // The signed-in person's name is the guest on each ticket.
  final guestName = ref.watch(sessionProvider).valueOrNull?.name ?? '';
  final api = ref.watch(receiptsApiProvider);

  // Step 2: read the settled payments.
  final payments = await api.settledPayments();

  // Step 3: read the booking lists for the booking modules the payments use, once each.
  final modules = {for (final p in payments) p['module'] as String? ?? ''}..removeWhere((m) => !bookingModulePaths.containsKey(m));
  final bookingLists = await Future.wait(modules.map(api.bookingsOf));
  final bookingById = {for (final b in bookingLists.expand((l) => l)) b['id'] as String? ?? '': b};

  // Step 4: map each payment with its booking, then sort newest first.
  final receipts = [
    for (final p in payments) receiptFromPayment(p, booking: bookingById[p['recordId'] as String? ?? ''], guestName: guestName),
  ]..sort((a, b) => b.at.compareTo(a.at));
  return receipts;
});
