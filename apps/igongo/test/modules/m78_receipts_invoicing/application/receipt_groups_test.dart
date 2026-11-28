// Unit tests for the My receipts rules: category filtering and day grouping.
// The receipts here are small test fixtures built in this file. They are not
// app data: the app reads real receipts from the API.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m78_receipts_invoicing/application/receipt_groups.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/guest_receipt.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/receipt_category.dart';

/// Builds a test receipt with only the fields the grouping rules read.
GuestReceipt _receipt(String id, ReceiptCategory category, int amount, DateTime at) => GuestReceipt(
  id: id,
  ref: id,
  outlet: '',
  description: '',
  category: category,
  amount: amount,
  method: '',
  place: '',
  at: at,
  points: 0,
  guestName: '',
  guestUnit: '',
  passNumber: '',
  gateCode: '',
  tableLabel: '',
  lines: const [],
  levy: 0,
  transactionId: '',
);

void main() {
  // A fixed "now" so the day labels never depend on the real clock.
  final now = DateTime(2026, 11, 28, 10);
  final today = DateTime(2026, 11, 28);
  final yesterday = DateTime(2026, 11, 27);
  // Newest first, as the screen shows them.
  final receipts = [
    _receipt('RC-84920', ReceiptCategory.dining, 34000, today.add(const Duration(hours: 13, minutes: 45))),
    _receipt('RC-84918', ReceiptCategory.wellness, 120000, today.add(const Duration(hours: 11, minutes: 15))),
    _receipt('RC-84882', ReceiptCategory.tours, 50000, yesterday.add(const Duration(hours: 15, minutes: 30))),
    _receipt('RC-84860', ReceiptCategory.dining, 48000, yesterday.add(const Duration(hours: 20, minutes: 10))),
    _receipt('IGN-8924', ReceiptCategory.stays, 260000, DateTime(2026, 11, 24, 14)),
  ];

  group('filterReceipts', () {
    test('All keeps every receipt in its order', () {
      expect(filterReceipts(receipts, null), receipts);
    });

    test('a category keeps only its receipts', () {
      final dining = filterReceipts(receipts, ReceiptCategory.dining);
      expect(dining.map((r) => r.id), ['RC-84920', 'RC-84860']);
    });

    test('an empty list stays empty for every filter', () {
      expect(filterReceipts(const [], ReceiptCategory.stays), isEmpty);
    });
  });

  group('receiptDayLabel', () {
    test('the same day reads Today and the day before reads Yesterday', () {
      expect(receiptDayLabel(DateTime(2026, 11, 28, 1), now), 'Today');
      expect(receiptDayLabel(DateTime(2026, 11, 27, 23), now), 'Yesterday');
    });

    test('any other day shows its date', () {
      expect(receiptDayLabel(DateTime(2026, 11, 24, 14), now), '24 Nov 2026');
    });
  });

  group('groupReceiptsByDay', () {
    test('groups the receipts under their headings with totals', () {
      final groups = groupReceiptsByDay(receipts, now);
      expect(groups.map((g) => g.label), ['Today', 'Yesterday', '24 Nov 2026']);
      expect(groups.map((g) => g.total), [154000, 98000, 260000]);
    });

    test('no receipts makes no groups', () {
      expect(groupReceiptsByDay(const [], now), isEmpty);
    });
  });
}
