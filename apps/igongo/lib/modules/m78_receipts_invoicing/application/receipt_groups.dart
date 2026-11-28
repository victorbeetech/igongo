// Pure rules for the My receipts list: which receipts a filter keeps, and how
// they group under day headings. No widgets here, so they are easy to test.

import '../domain/guest_receipt.dart';
import '../domain/receipt_category.dart';
import '../domain/receipt_day_group.dart';

/// Month names for the date headings, January first.
const _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// Keeps the receipts in [category], or every receipt when [category] is null (the "All" pill).
List<GuestReceipt> filterReceipts(List<GuestReceipt> receipts, ReceiptCategory? category) {
  // Step 1: "All" keeps everything.
  if (category == null) return receipts;
  // Step 2: otherwise keep only the matching category, in the same order.
  return receipts.where((r) => r.category == category).toList();
}

/// The heading for the day of [at], judged against [now]: "Today", "Yesterday" or "24 Nov 2026".
String receiptDayLabel(DateTime at, DateTime now) {
  // Step 1: compare calendar days, not hours, so late receipts still group by day.
  final day = DateTime(at.year, at.month, at.day);
  final today = DateTime(now.year, now.month, now.day);
  final difference = today.difference(day).inDays;
  // Step 2: the two named days come first.
  if (difference == 0) return 'Today';
  if (difference == 1) return 'Yesterday';
  // Step 3: any other day shows its date.
  return '${at.day} ${_months[at.month - 1]} ${at.year}';
}

/// Groups [receipts] under their day headings, keeping the order they came in.
List<ReceiptDayGroup> groupReceiptsByDay(List<GuestReceipt> receipts, DateTime now) {
  // Step 1: collect the groups in the order each day first appears.
  final groups = <String, List<GuestReceipt>>{};
  for (final r in receipts) {
    groups.putIfAbsent(receiptDayLabel(r.at, now), () => []).add(r);
  }
  // Step 2: turn each heading and its receipts into a group.
  return [for (final e in groups.entries) ReceiptDayGroup(label: e.key, receipts: e.value)];
}
