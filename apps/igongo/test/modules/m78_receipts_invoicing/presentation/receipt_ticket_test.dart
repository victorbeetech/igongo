// The receipt ticket: its QR code holds the pass number, the caption shows the
// last part of it, and the barcode with the full number sits under it, in light
// and dark mode.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m78_receipts_invoicing/demo/demo_receipts.dart';
import 'package:igongo/modules/m78_receipts_invoicing/presentation/receipt_detail/ticket/receipt_ticket.dart';
import 'package:igongo/shared/ui/ticket/barcode_strip.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../../support/pump_component.dart';

void main() {
  bothModes('the QR code holds the pass number, with the barcode under it', (tester, dark) async {
    // Step 1: one receipt from the demo list, so the test uses a real pass number shape.
    final receipt = demoReceipts(DateTime(2026, 11, 28)).first;
    await pumpComponent(tester, ReceiptTicket(receipt: receipt), dark: dark);
    // Step 2: the QR code must encode exactly the pass number the guest sees.
    final qr = tester.widget<QrImageView>(find.byType(QrImageView));
    expect(qr.data, receipt.passNumber);
    // Step 3: the caption under the QR code is the last part of the number.
    expect(find.text(receipt.passNumber.split('-').last), findsOneWidget);
    // Step 4: the barcode and its full number under it.
    expect(find.byType(BarcodeStrip), findsOneWidget);
    expect(find.text('* ${receipt.passNumber} *'), findsOneWidget);
  });
}
