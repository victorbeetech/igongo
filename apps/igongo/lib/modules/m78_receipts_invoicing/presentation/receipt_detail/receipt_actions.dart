// The buttons under the ticket: Download PDF as the main action, then Print and
// Email receipt goes through the API. Download PDF and Print build the receipt
// as a PDF on the phone and share it or send it to the printer.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:printing/printing.dart';

import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/my_receipts_provider.dart';
import '../../domain/guest_receipt.dart';
import '../../infrastructure/receipt_pdf_builder.dart';

/// The three action buttons for [receipt].
class ReceiptActions extends ConsumerWidget {
  /// Creates the actions for [receipt].
  const ReceiptActions({super.key, required this.receipt});

  /// The receipt the actions work on (the data they will send later).
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context, WidgetRef ref) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: IgongoSpace.sm,
    children: [
      // The main action: the full-width Download PDF button.
      IgongoButton(
        label: 'Download PDF Pass',
        icon: Icons.file_download_outlined,
        expand: true,
        onPressed: () => _downloadPdf(context),
      ),
      // The two smaller actions side by side.
      Row(
        spacing: IgongoSpace.sm,
        children: [
          Expanded(
            child: IgongoButton(
              label: 'Print Receipt',
              icon: Icons.print_outlined,
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: () => _print(context),
            ),
          ),
          Expanded(
            child: IgongoButton(
              label: 'Email receipt',
              icon: Icons.send_outlined,
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: () => _emailReceipt(context, ref),
            ),
          ),
        ],
      ),
    ],
  );

  /// Builds the receipt PDF and opens the phone's share sheet so it can be saved.
  Future<void> _downloadPdf(BuildContext context) async {
    try {
      final bytes = await buildReceiptPdf(receipt);
      await Printing.sharePdf(bytes: bytes, filename: 'receipt-${receipt.ref}.pdf');
    } on Object {
      if (context.mounted) showIgongoToast(context, 'The receipt could not be saved');
    }
  }

  /// Builds the receipt PDF and opens the phone's print dialog.
  Future<void> _print(BuildContext context) async {
    try {
      final bytes = await buildReceiptPdf(receipt);
      await Printing.layoutPdf(onLayout: (_) async => bytes, name: 'receipt-${receipt.ref}');
    } on Object {
      if (context.mounted) showIgongoToast(context, 'The receipt could not be printed');
    }
  }

  /// Asks the API to email this receipt to the payer and reports the result in a toast.
  Future<void> _emailReceipt(BuildContext context, WidgetRef ref) async {
    try {
      final result = await ref.read(receiptsApiProvider).emailReceipt(receipt.id);
      if (!context.mounted) return;
      final sent = result['sent'] == true;
      showIgongoToast(context, sent ? 'Receipt emailed' : (result['reason'] as String? ?? 'Receipt could not be emailed'));
    } on Object {
      if (context.mounted) showIgongoToast(context, 'Receipt could not be emailed');
    }
  }
}
