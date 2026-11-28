// The buttons under the ticket: Download PDF as the main action, then Print and
// WhatsApp / Mail. They are placeholders until the receipt file and sending are wired.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../domain/guest_receipt.dart';

/// The three action buttons for [receipt].
class ReceiptActions extends StatelessWidget {
  /// Creates the actions for [receipt].
  const ReceiptActions({super.key, required this.receipt});

  /// The receipt the actions work on (the data they will send later).
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) => Column(
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
              label: 'WhatsApp / Mail',
              icon: Icons.send_outlined,
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: () => _comingSoon(context),
            ),
          ),
        ],
      ),
    ],
  );

  /// Shows the placeholder toast until the action is wired.
  void _comingSoon(BuildContext context) => showIgongoToast(context, 'Coming soon for ${receipt.ref}');
}
