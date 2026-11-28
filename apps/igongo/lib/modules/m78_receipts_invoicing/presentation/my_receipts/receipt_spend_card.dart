// The total-spend summary at the top of My receipts: the amount this visit,
// the settled count, the points earned and the folio line with its Statement link.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';

/// A crimson band with the spend card on it.
class ReceiptSpendCard extends StatelessWidget {
  /// Creates the summary for [total] shillings across [settled] receipts.
  const ReceiptSpendCard({
    super.key,
    required this.total,
    required this.settled,
    required this.points,
    required this.folio,
    required this.onStatement,
  });

  /// The total paid, in whole shillings.
  final int total;

  /// How many receipts are settled.
  final int settled;

  /// Loyalty points earned.
  final int points;

  /// The folio line, such as "Folio #IGN-2026-9041 • Checked in at Deluxe Cottage 04".
  final String folio;

  /// Opens the guest's statement.
  final VoidCallback onStatement;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      // Step 1: the crimson band, rounded only at the bottom, as the design has it.
      decoration: BoxDecoration(
        color: p.primary,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(IgongoRadius.lg)),
      ),
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.lg),
      child: Container(
        // Step 2: the white card sitting on the band.
        padding: const EdgeInsets.all(IgongoSpace.lg),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          border: Border.all(color: p.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: IgongoSpace.xs,
          children: [
            // Step 3: the label on the left, the points chip on the right.
            Row(
              children: [
                Expanded(
                  child: Text('TOTAL SPEND THIS VISIT', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
                ),
                _PointsChip(points: points),
              ],
            ),
            // Step 4: the amount, with the settled count beside it.
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Expanded(
                  child: Text(
                    ugx(total),
                    style: context.text.headlineMedium?.copyWith(color: p.primaryText, fontWeight: FontWeight.w700),
                  ),
                ),
                Text('$settled settled', style: context.text.labelMedium?.copyWith(color: p.accent)),
              ],
            ),
            // Step 5: the folio line and the statement link, on one row.
            Row(
              children: [
                Expanded(
                  child: Text(folio, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                ),
                TextButton(
                  onPressed: onStatement,
                  style: TextButton.styleFrom(
                    minimumSize: const Size(IgongoTouch.minimum, IgongoTouch.minimum),
                    foregroundColor: p.primaryText,
                  ),
                  child: const Text('STATEMENT ›'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// The small accent chip that shows the points earned.
class _PointsChip extends StatelessWidget {
  /// Creates the chip for [points].
  const _PointsChip({required this.points});

  /// The points to show.
  final int points;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: p.accent.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
        child: Text('+$points Pts', style: context.text.labelSmall?.copyWith(color: p.text)),
      ),
    );
  }
}
