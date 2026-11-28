// A day heading on the My receipts list, with its receipts and their total.

import 'guest_receipt.dart';

/// Receipts made on one day, under a heading such as "Today" or "24 Nov 2026".
class ReceiptDayGroup {
  /// Creates a group with its heading [label] and [receipts], newest first.
  const ReceiptDayGroup({required this.label, required this.receipts});

  /// The heading words: "Today", "Yesterday" or a date.
  final String label;

  /// The receipts under this heading, in the order the list shows them.
  final List<GuestReceipt> receipts;

  /// The total paid under this heading, in whole shillings.
  int get total => receipts.fold(0, (sum, r) => sum + r.amount);
}
