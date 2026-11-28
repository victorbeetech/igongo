// Receipt Detail: one receipt as a boarding-pass ticket, with its status, a
// praise line for the chef, and the Download PDF, Print and WhatsApp/Mail actions.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../domain/guest_receipt.dart';
import 'receipt_actions.dart';
import 'receipt_praise_card.dart';
import 'ticket/receipt_ticket.dart';

/// Where the receipt was issued, shown above the ticket as the design has it.
const _issuedAt = 'Folio Settled • Biharwe, Mbarara';

/// The full receipt page. It pushes on top of the list, so it has its own bar.
class ReceiptDetailScreen extends StatelessWidget {
  /// Creates the page for [receipt].
  const ReceiptDetailScreen({super.key, required this.receipt});

  /// The receipt to show.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      backgroundColor: p.background,
      appBar: AppBar(
        title: const Text('Receipt Detail'),
        backgroundColor: p.primary,
        foregroundColor: p.onPrimary,
        actions: [
          IconButton(
            tooltip: 'Share receipt',
            icon: const Icon(Icons.share),
            onPressed: () => showIgongoToast(context, 'Sharing is coming soon'),
          ),
          IconButton(
            tooltip: 'Download PDF',
            icon: const Icon(Icons.download),
            onPressed: () => showIgongoToast(context, 'Download is coming soon'),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: IgongoSpace.lg,
            children: [
              // Step 1: the settled status line above the ticket.
              const _StatusLine(),
              // Step 2: the ticket itself.
              ReceiptTicket(receipt: receipt),
              // Step 3: the praise line for the chef.
              const ReceiptPraiseCard(),
              // Step 4: the actions.
              ReceiptActions(receipt: receipt),
              // Step 5: the hotel's tag line and address.
              const _Footer(),
            ],
          ),
        ),
      ),
    );
  }
}

/// The settled status with the verified pass chip.
class _StatusLine extends StatelessWidget {
  /// Creates the status line.
  const _StatusLine();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      children: [
        Expanded(
          child: Text(
            _issuedAt.toUpperCase(),
            style: context.text.labelSmall?.copyWith(color: p.accent),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        Icon(Icons.verified, size: IgongoSpace.lg, color: p.accent),
        const SizedBox(width: IgongoSpace.xxs),
        Text('VERIFIED PASS', style: context.text.labelSmall?.copyWith(color: p.accent)),
      ],
    );
  }
}

/// The hotel's tag line and address under the actions.
class _Footer extends StatelessWidget {
  /// Creates the footer.
  const _Footer();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      spacing: IgongoSpace.xs,
      children: [
        Text(
          '"Where Heritage Meets Tranquility"',
          style: context.text.bodyMedium?.copyWith(color: p.primary, fontStyle: FontStyle.italic),
          textAlign: TextAlign.center,
        ),
        Text(
          'Igongo Cultural Centre & Country Hotel • Mbarara-Masaka Highway',
          style: context.text.labelSmall?.copyWith(color: p.textMuted),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
