// The receipt sheet opened from a card: the amount, the payment facts and the
// Download PDF, Share and View full receipt actions.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../domain/guest_receipt.dart';
import '../receipt_detail/receipt_detail_screen.dart';

/// Opens the receipt sheet for [receipt] from the bottom of the screen.
Future<void> showReceiptSheet(BuildContext context, GuestReceipt receipt) => showModalBottomSheet<void>(
  context: context,
  isScrollControlled: true,
  showDragHandle: true,
  builder: (_) => _ReceiptSheet(receipt: receipt),
);

/// The sheet body. It scrolls on small screens and at large text sizes.
class _ReceiptSheet extends StatelessWidget {
  /// Creates the sheet for [receipt].
  const _ReceiptSheet({required this.receipt});

  /// The receipt to show.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: IgongoSpace.md,
          children: [
            // Step 1: the heading.
            Text('OFFICIAL E-TICKET', style: context.text.labelSmall?.copyWith(color: p.accent)),
            Text('Receipt details', style: context.text.headlineSmall?.copyWith(color: p.primary)),
            // Step 2: the amount and the fiscal status.
            _AmountPanel(amount: receipt.amount),
            // Step 3: the facts about the payment.
            const _Fact(label: 'Merchant', value: 'Igongo Country Hotel'),
            _Fact(label: 'Location / Outlet', value: receipt.outlet),
            _Fact(label: 'Reference', value: receipt.ref),
            _Fact(label: 'Payment method', value: receipt.method),
            const _Fact(label: 'Status', value: 'Verified & Settled', highlight: true),
            // Step 4: the actions. Download and share are wired later.
            IgongoButton(
              label: 'Download PDF',
              icon: Icons.download,
              expand: true,
              onPressed: () => showIgongoToast(context, 'Download is coming soon'),
            ),
            IgongoButton(
              label: 'Share',
              icon: Icons.share,
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: () => showIgongoToast(context, 'Sharing is coming soon'),
            ),
            // Step 5: the full ticket page.
            IgongoButton(
              label: 'View full receipt',
              variant: ButtonVariant.text,
              expand: true,
              onPressed: () =>
                  Navigator.of(context)
                      .push(MaterialPageRoute<void>(builder: (_) => ReceiptDetailScreen(receipt: receipt))),
            ),
          ],
        ),
      ),
    );
  }
}

/// The big amount with its "Payment Completed" chip.
class _AmountPanel extends StatelessWidget {
  /// Creates the panel for [amount] shillings.
  const _AmountPanel({required this.amount});

  /// The amount to show.
  final int amount;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Column(
        spacing: IgongoSpace.xs,
        children: [
          Icon(Icons.verified, color: p.accent),
          Text(ugx(amount), style: context.text.headlineMedium?.copyWith(color: p.primary)),
          Text('Payment Completed • URA Fiscalized', style: context.text.labelSmall),
        ],
      ),
    );
  }
}

/// One label and value row in the sheet.
class _Fact extends StatelessWidget {
  /// Creates a row. [highlight] colours the value in the accent tone.
  const _Fact({required this.label, required this.value, this.highlight = false});

  /// The label on the left.
  final String label;

  /// The value on the right.
  final String value;

  /// Whether the value uses the accent colour (for the status line).
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
        const SizedBox(width: IgongoSpace.sm),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: context.text.bodyMedium?.copyWith(color: highlight ? p.accent : p.text, fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }
}
