// Unit tests for turning an API payment into a guest receipt.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m78_receipts_invoicing/application/payment_receipt_mapper.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/receipt_category.dart';

void main() {
  // A payment as the payments API returns it (test fixture, not app data).
  final payment = <String, dynamic>{
    'id': 'pay_1',
    'module': 'room-bookings',
    'label': 'Room RB-7KQ2MX',
    'outlet': null,
    'method': 'mtn_momo',
    'amount': 260000,
    'status': 'succeeded',
    'providerRef': 'prov-99',
    'createdAt': '2026-11-27T10:00:00.000Z',
    'settledAt': '2026-11-27T10:01:00.000Z',
  };

  test('maps the real payment fields onto the receipt', () {
    final r = receiptFromPayment(payment);
    expect(r.id, 'pay_1');
    expect(r.ref, 'Room RB-7KQ2MX');
    expect(r.outlet, 'Room RB-7KQ2MX', reason: 'no outlet name falls back to the label');
    expect(r.amount, 260000);
    expect(r.method, 'MTN MoMo');
    expect(r.transactionId, 'prov-99');
    expect(r.category, ReceiptCategory.stays);
    expect(r.at, DateTime.parse('2026-11-27T10:01:00.000Z').toLocal(), reason: 'settled time is used first');
  });

  test('fields the payments API does not hold stay empty, never sample values', () {
    final r = receiptFromPayment(payment);
    expect(r.guestName, isEmpty);
    expect(r.passNumber, isEmpty);
    expect(r.lines, isEmpty);
    expect(r.points, 0);
    expect(r.levy, 0);
  });

  test('every module maps to its filter pill', () {
    expect(categoryForModule('museum'), ReceiptCategory.tours);
    expect(categoryForModule('crafts-bookshop'), ReceiptCategory.tours);
    expect(categoryForModule('pool'), ReceiptCategory.wellness);
    expect(categoryForModule('spa'), ReceiptCategory.wellness);
    expect(categoryForModule('food-ordering'), ReceiptCategory.dining);
    expect(categoryForModule('events-conferences'), ReceiptCategory.dining);
  });

  test('an unknown method code shows its words, not its code', () {
    expect(methodLabel('mystery_pay'), 'mystery pay');
  });
}
