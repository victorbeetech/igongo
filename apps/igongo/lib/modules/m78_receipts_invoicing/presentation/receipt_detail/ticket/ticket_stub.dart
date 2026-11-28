// The crimson top stub of the ticket: the hotel logo and folio name on the
// left, the scannable QR code of the pass on the right, then the pass number
// and the points earned.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/logo/igongo_logo.dart';
import '../../../../../shared/ui/ticket/ticket_qr_code.dart';
import '../../../domain/guest_receipt.dart';

/// The side of the pass QR code: large enough to scan from a short distance.
const _qrSize = IgongoSpace.xxl * 3;

/// The crimson band at the top of the ticket.
class ReceiptTicketStub extends StatelessWidget {
  /// Creates the stub for [receipt].
  const ReceiptTicketStub({super.key, required this.receipt});

  /// The receipt the stub belongs to.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      color: p.primary,
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the logo and the folio name, with the pass QR code beside them.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xxs,
                  children: [
                    // The logo sits on a light chip so it reads on crimson; the brand kit's own file is used.
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
                      child: const IgongoLogo(shape: LogoShape.horizontal, height: 28),
                    ),
                    Text(
                      'LUXURY HERITAGE FOLIO',
                      style: context.text.labelSmall?.copyWith(color: p.onPrimary.withValues(alpha: 0.85)),
                    ),
                  ],
                ),
              ),
              // The real QR code of the pass number, with its last part as the caption.
              TicketQrCode(
                data: receipt.passNumber,
                size: _qrSize,
                caption: receipt.passNumber.split('-').last,
              ),
            ],
          ),
          // Step 2: the electronic pass number and the points earned.
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ELECTRONIC PASS NO.',
                      style: context.text.labelSmall?.copyWith(color: p.onPrimary.withValues(alpha: 0.8)),
                    ),
                    Text(
                      receipt.passNumber,
                      style: context.text.headlineSmall?.copyWith(color: p.onPrimary, letterSpacing: 1.5),
                    ),
                  ],
                ),
              ),
              _PointsBadge(points: receipt.points),
            ],
          ),
        ],
      ),
    );
  }
}

/// The small pill that shows the royal points earned on this receipt.
class _PointsBadge extends StatelessWidget {
  /// Creates the badge for [points].
  const _PointsBadge({required this.points});

  /// The points to show.
  final int points;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: context.palette.onPrimary.withValues(alpha: 0.12),
      borderRadius: BorderRadius.circular(IgongoRadius.pill),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      child: Text('+$points Royal Pts', style: context.text.labelSmall?.copyWith(color: context.palette.accent)),
    ),
  );
}
