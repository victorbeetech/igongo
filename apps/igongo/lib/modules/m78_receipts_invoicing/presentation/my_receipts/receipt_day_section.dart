// One day on the list: the heading with that day's total, then its receipt cards.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/guest_receipt.dart';
import '../../domain/receipt_day_group.dart';
import 'receipt_card.dart';

/// A heading such as "Today" with its receipts underneath.
class ReceiptDaySection extends StatelessWidget {
  /// Creates the section for [group]; [onOpen] gets the tapped receipt's id.
  const ReceiptDaySection({super.key, required this.group, required this.onOpen});

  /// The day to show.
  final ReceiptDayGroup group;

  /// Called with the tapped receipt.
  final void Function(GuestReceipt receipt) onOpen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.sm,
      children: [
        // Step 1: the heading on the left, the day's total on the right.
        Row(
          children: [
            Container(width: IgongoSpace.xs, height: IgongoSpace.md, color: p.accent),
            const SizedBox(width: IgongoSpace.sm),
            Expanded(
              child: Text(
                group.label.toUpperCase(),
                style: context.text.labelSmall?.copyWith(color: p.accent, fontWeight: FontWeight.w700),
              ),
            ),
            Text(ugx(group.total), style: context.text.bodySmall?.copyWith(color: p.textMuted)),
          ],
        ),
        // Step 2: the cards, one under another.
        for (final r in group.receipts) ReceiptCard(receipt: r, onTap: () => onOpen(r)),
      ],
    );
  }
}
