// The bottom of the ticket: the security token and tier, the barcode strip with
// its code, and a line about the pass.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/ticket/barcode_strip.dart';
import '../../../../../shared/ui/ticket/ticket_code_panel.dart';
import '../../../domain/guest_receipt.dart';

/// The footer with the security row and the barcode.
class TicketFooter extends StatelessWidget {
  /// Creates the footer for [receipt].
  const TicketFooter({super.key, required this.receipt});

  /// The receipt whose code the barcode carries.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      color: p.surfaceAlt,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the security token on the left and the loyalty tier on the right.
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('SECURITY AUTH TOKEN', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
                    Text('PASS-SEC // 773-984', style: context.text.labelMedium),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('IGONGO ROYAL LOYALTY', style: context.text.labelSmall?.copyWith(color: p.accent)),
                  Text('Tier: Silver Horn', style: context.text.labelMedium),
                ],
              ),
            ],
          ),
          // Step 2: the barcode on the same white panel as the QR code, with its code under it.
          TicketCodePanel(
            child: Column(
              children: [
                BarcodeStrip(code: receipt.passNumber),
                const SizedBox(height: IgongoSpace.xs),
                Text(
                  '* ${receipt.passNumber} *',
                  style: context.text.labelSmall?.copyWith(color: IgongoColorsLight.brandInk, letterSpacing: 2),
                ),
              ],
            ),
          ),
          // Step 3: a note about what the pass is for.
          Text(
            'Keep this digital pass for complimentary museum admission & safari briefing.',
            style: context.text.bodySmall?.copyWith(color: p.textMuted),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
