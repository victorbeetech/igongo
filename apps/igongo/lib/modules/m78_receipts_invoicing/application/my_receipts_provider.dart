// Supplies the guest's receipts to the My receipts screen. For now it returns
// the sample receipts (see demo/demo_receipts.dart). When the API is wired,
// this provider reads the guest's receipts from it instead; the screen does
// not change.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../demo/demo_receipts.dart';
import '../domain/guest_receipt.dart';

/// The guest's receipts, newest first. An empty list shows the empty state.
final myReceiptsProvider = Provider<List<GuestReceipt>>((ref) => demoReceipts(DateTime.now()));
