// The buttons under the ticket: Download PDF as the main action, then Print and
// Email receipt. Email is wired to the API; Download PDF and Print are still
// placeholders until the receipt file is built.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/my_receipts_provider.dart';
import '../../domain/guest_receipt.dart';

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
        onPressed: () => _comingSoon(context),
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
              onPressed: () => _comingSoon(context),
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

  /// Shows the placeholder toast for the actions that are not built yet (PDF, print).
  void _comingSoon(BuildContext context) => showIgongoToast(context, 'Coming soon for ${receipt.ref}');

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
