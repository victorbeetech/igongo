// Supplies the guest's receipts to the My receipts screen and the Receipt
// Detail ticket. Reads the person's succeeded payments from the API and maps
// each one with receiptFromPayment. It reloads when the session changes, so
// a sign-out or a new sign-in never shows the previous person's receipts.

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
  ref.watch(sessionProvider);
  // Step 2: fetch the settled payments.
  final payments = await ref.watch(receiptsApiProvider).settledPayments();
  // Step 3: map them and sort newest first.
  final receipts = payments.map(receiptFromPayment).toList()..sort((a, b) => b.at.compareTo(a.at));
  return receipts;
});
