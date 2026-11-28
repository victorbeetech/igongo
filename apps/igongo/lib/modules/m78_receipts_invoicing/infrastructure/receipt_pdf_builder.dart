// Builds the receipt as an A5 PDF, for Download PDF and Print on the Receipt
// Detail screen. Only the receipt's own values are printed; empty values are
// left out of the page instead of printing blank lines.

import 'dart:typed_data';

import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

import '../../../shared/format/ugx.dart';
import '../domain/guest_receipt.dart';

/// Turns [receipt] into PDF bytes, ready to save, share or print.
Future<Uint8List> buildReceiptPdf(GuestReceipt receipt) async {
  // Step 1: the document, A5 portrait with a margin on every side.
  final doc = pw.Document();
  doc.addPage(
    pw.Page(
      pageFormat: PdfPageFormat.a5,
      margin: const pw.EdgeInsets.all(24),
      build: (context) => pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          // Step 2: the hotel name and the receipt reference.
          pw.Text(
            'IGONGO COUNTRY HOTEL & CULTURAL CENTRE',
            style: const pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold),
          ),
          pw.SizedBox(height: 4),
          pw.Text('Receipt ${receipt.ref}', style: const pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 12),
          // Step 3: the facts of the payment, skipping any that are empty.
          for (final row in _facts(receipt)) _row(row.$1, row.$2),
          pw.Divider(height: 20),
          // Step 4: the lines bought, if any.
          for (final line in receipt.lines) _row(line.name, ugx(line.amount), detail: line.detail),
          if (receipt.lines.isNotEmpty) pw.Divider(height: 20),
          // Step 5: the total paid.
          _row('Total paid', ugx(receipt.amount), bold: true),
          pw.Spacer(),
          pw.Text('Show this receipt or the booking code at the door.', style: const pw.TextStyle(fontSize: 8)),
        ],
      ),
    ),
  );
  // Step 6: the file's bytes.
  return doc.save();
}

/// The labelled facts of a receipt, in print order. Empty values are dropped.
List<(String, String)> _facts(GuestReceipt r) => [
  ('Outlet or service', r.outlet),
  ('Booking or pass number', r.passNumber),
  ('Guest', r.guestName),
  ('Payment method', r.method),
  ('Transaction', r.transactionId),
].where((f) => f.$2.isNotEmpty).toList();

/// One label-and-value row, with an optional smaller line under the label.
pw.Widget _row(String label, String value, {String? detail, bool bold = false}) => pw.Padding(
  padding: const pw.EdgeInsets.symmetric(vertical: 3),
  child: pw.Row(
    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
    crossAxisAlignment: pw.CrossAxisAlignment.start,
    children: [
      pw.Expanded(
        child: pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              label,
              style: pw.TextStyle(fontSize: 10, fontWeight: bold ? pw.FontWeight.bold : pw.FontWeight.normal),
            ),
            if (detail != null && detail.isNotEmpty) pw.Text(detail, style: const pw.TextStyle(fontSize: 8)),
          ],
        ),
      ),
      pw.SizedBox(width: 8),
      pw.Text(value, style: const pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
    ],
  ),
);
