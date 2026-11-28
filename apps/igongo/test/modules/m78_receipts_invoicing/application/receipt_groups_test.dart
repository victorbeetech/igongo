// Unit tests for the My receipts rules: category filtering and day grouping.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m78_receipts_invoicing/application/receipt_groups.dart';
import 'package:igongo/modules/m78_receipts_invoicing/demo/demo_receipts.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/receipt_category.dart';

void main() {
  // A fixed "now" so the day labels never depend on the real clock.
  final now = DateTime(2026, 11, 28, 10);
  final receipts = demoReceipts(now);

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
    test('groups the sample receipts under their headings with totals', () {
      final groups = groupReceiptsByDay(receipts, now);
      expect(groups.map((g) => g.label), ['Today', 'Yesterday', '24 Nov 2026']);
      expect(groups.map((g) => g.total), [154000, 98000, 260000]);
    });

    test('no receipts makes no groups', () {
      expect(groupReceiptsByDay(const [], now), isEmpty);
    });
  });
}
