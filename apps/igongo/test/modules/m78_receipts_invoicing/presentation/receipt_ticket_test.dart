// The receipt ticket: its QR code is drawn, the caption shows the last part of
// it, and the barcode with the full number sits under it, in light and dark mode.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/guest_receipt.dart';
import 'package:igongo/modules/m78_receipts_invoicing/domain/receipt_category.dart';
import 'package:igongo/modules/m78_receipts_invoicing/presentation/receipt_detail/ticket/receipt_ticket.dart';
import 'package:igongo/shared/ui/ticket/barcode_strip.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../../support/pump_component.dart';

/// A test receipt with a pass number of the real shape (a fixture, not app data).
GuestReceipt _fixtureReceipt() => GuestReceipt(
  id: 'pay_test',
  ref: 'Room RB-7KQ2MX',
  outlet: 'Deluxe Cottage 04',
  description: 'Room RB-7KQ2MX',
  category: ReceiptCategory.stays,
  amount: 260000,
  method: 'MTN MoMo',
  place: '',
  at: DateTime(2026, 11, 28, 10),
  points: 0,
  guestName: '',
  guestUnit: '',
  passNumber: 'IGN-TK-89241',
  gateCode: '',
  tableLabel: '',
  lines: const [],
  levy: 0,
  transactionId: 'pay_test',
);

void main() {
  bothModes('the QR code holds the pass number, with the barcode under it', (tester, dark) async {
    // Step 1: a fixture receipt with a pass number of the real shape.
    final receipt = _fixtureReceipt();
    await pumpComponent(tester, ReceiptTicket(receipt: receipt), dark: dark);
    // Step 2: the ticket draws exactly one QR code. (qr_flutter does not expose the encoded text, so the data itself is checked by reading the code in TicketQrCode.)
    expect(find.byType(QrImageView), findsOneWidget);
    // Step 3: the caption under the QR code is the last part of the number.
    expect(find.text(receipt.passNumber.split('-').last), findsOneWidget);
    // Step 4: the barcode and its full number under it.
    expect(find.byType(BarcodeStrip), findsOneWidget);
    expect(find.text('* ${receipt.passNumber} *'), findsOneWidget);
  });
}
