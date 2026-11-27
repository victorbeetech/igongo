// The row of three shortcuts under the tiles on the Bookings home: History,
// Receipts and Past Visits, in one cream card with thin dividers.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../../ui/card/igongo_card.dart';

/// The three shortcuts; each callback opens its screen.
class BookingShortcuts extends StatelessWidget {
  /// Creates the row.
  const BookingShortcuts({super.key, required this.onHistory, required this.onReceipts, required this.onPastVisits});

  /// Opens the booking history.
  final VoidCallback onHistory;

  /// Opens the receipts.
  final VoidCallback onReceipts;

  /// Opens the past visits.
  final VoidCallback onPastVisits;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    Widget one(IconData icon, String label, VoidCallback onTap) => Expanded(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: IgongoSpace.sm),
          child: Column(
            spacing: IgongoSpace.xs,
            children: [
              Icon(icon, color: p.primary, size: 28),
              Text(label, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          ),
        ),
      ),
    );
    return IgongoCard(
      padding: EdgeInsets.zero,
      child: IntrinsicHeight(
        child: Row(
          children: [
            one(Icons.history, 'History', onHistory),
            VerticalDivider(width: 1, color: p.border),
            one(Icons.receipt_long_outlined, 'Receipts', onReceipts),
            VerticalDivider(width: 1, color: p.border),
            one(Icons.event_available_outlined, 'Past Visits', onPastVisits),
          ],
        ),
      ),
    );
  }
}
