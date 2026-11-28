// One receipt on the list: icon, outlet, description, amount, payment method,
// place, time and reference. Tapping it opens the receipt sheet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/guest_receipt.dart';
import 'receipt_category_icon.dart';

/// A white card for one receipt.
class ReceiptCard extends StatelessWidget {
  /// Creates the card for [receipt]; [onTap] opens its detail sheet.
  const ReceiptCard({super.key, required this.receipt, required this.onTap});

  /// The receipt to show.
  final GuestReceipt receipt;

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: '${receipt.outlet}, ${ugx(receipt.amount)}',
      child: Material(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(IgongoSpace.md),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(IgongoRadius.md),
              border: Border.all(color: p.border),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 1: the category icon in a soft square.
                _IconTile(icon: receiptCategoryIcon(receipt.category)),
                const SizedBox(width: IgongoSpace.md),
                // Step 2: the text column, which takes the space left over.
                Expanded(child: _Details(receipt: receipt)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// The square icon tile at the start of the card.
class _IconTile extends StatelessWidget {
  /// Creates the tile showing [icon].
  const _IconTile({required this.icon});

  /// The category icon.
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
    width: IgongoTouch.preferred,
    height: IgongoTouch.preferred,
    alignment: Alignment.center,
    decoration: BoxDecoration(color: context.palette.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
    child: Icon(icon, color: context.palette.primaryText),
  );
}

/// The words and figures on a receipt card.
class _Details extends StatelessWidget {
  /// Creates the details for [receipt].
  const _Details({required this.receipt});

  /// The receipt to describe.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final time = _clock(receipt.at);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xxs,
      children: [
        // Step 3: outlet on the left, amount on the right.
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(receipt.outlet, style: context.text.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text(
                    receipt.description,
                    style: context.text.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: IgongoSpace.sm),
            Text(ugx(receipt.amount), style: context.text.titleSmall?.copyWith(color: p.primaryText)),
          ],
        ),
        // Step 4: payment method, place and time.
        Row(
          children: [
            Flexible(
              child: Text(
                '${receipt.method} • ${receipt.place}',
                style: context.text.bodySmall?.copyWith(color: p.textMuted),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: IgongoSpace.sm),
            Text(time, style: context.text.bodySmall),
          ],
        ),
        // Step 5: the printed reference, in small type.
        Text(receipt.ref, style: context.text.labelSmall?.copyWith(color: p.textMuted)),
      ],
    );
  }
}

/// [at] as a 24-hour clock time such as "13:45" (the hotel keeps one clock).
String _clock(DateTime at) => '${at.hour.toString().padLeft(2, '0')}:${at.minute.toString().padLeft(2, '0')}';
