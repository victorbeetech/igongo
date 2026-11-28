// The boarding-pass style receipt: a crimson stub on top, a perforated tear
// line, the body with the manifest and totals, another tear line, and the
// security footer with the barcode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../domain/guest_receipt.dart';
import 'ticket_body.dart';
import 'ticket_footer.dart';
import 'ticket_perforation.dart';
import 'ticket_stub.dart';

/// The whole ticket for [receipt].
class ReceiptTicket extends StatelessWidget {
  /// Creates the ticket.
  const ReceiptTicket({super.key, required this.receipt});

  /// The receipt to draw.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      // Step 1: the card that holds the three parts, with a soft edge.
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: p.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 2: the crimson stub with the pass number and the hotel logo.
          ReceiptTicketStub(receipt: receipt),
          // Step 3: the first tear line.
          const TicketPerforation(),
          // Step 4: the guest, the stay, the manifest and the totals.
          TicketBody(receipt: receipt),
          // Step 5: the second tear line.
          const TicketPerforation(),
          // Step 6: the security strip and barcode.
          TicketFooter(receipt: receipt),
        ],
      ),
    );
  }
}
