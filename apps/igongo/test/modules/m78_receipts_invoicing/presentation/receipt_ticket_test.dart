// The receipt ticket: its QR code is drawn, the caption shows the
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
    // Step 2: the ticket draws exactly one QR code. (qr_flutter does not expose the encoded text, so the data itself is checked by reading the code in TicketQrCode.)
    expect(find.byType(QrImageView), findsOneWidget);
    // Step 3: the caption under the QR code is the last part of the number.
    expect(find.text(receipt.passNumber.split('-').last), findsOneWidget);
    // Step 4: the barcode and its full number under it.
    expect(find.byType(BarcodeStrip), findsOneWidget);
    expect(find.text('* ${receipt.passNumber} *'), findsOneWidget);
  });
}
