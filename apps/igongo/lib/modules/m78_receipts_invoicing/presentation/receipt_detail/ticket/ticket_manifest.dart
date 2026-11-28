// The manifest on the ticket: each bought item with its description and amount.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../domain/guest_receipt.dart';

/// The list of items in a grey panel with a header row.
class TicketManifest extends StatelessWidget {
  /// Creates the manifest for [receipt].
  const TicketManifest({super.key, required this.receipt});

  /// The receipt whose lines to list.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // The header row: what the columns are.
          Row(
            children: [
              Expanded(
                child: Text('MANIFEST LINE ITEMS', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
              ),
              Text('AMOUNT (UGX)', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
            ],
          ),
          const Divider(height: IgongoSpace.lg),
          // One row per item, with a divider between them.
          for (var i = 0; i < receipt.lines.length; i++) ...[
            if (i > 0) Divider(color: p.border, height: IgongoSpace.lg),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(receipt.lines[i].name, style: context.text.labelLarge),
                      Text(receipt.lines[i].detail, style: context.text.bodySmall?.copyWith(color: p.textMuted)),
                    ],
                  ),
                ),
                const SizedBox(width: IgongoSpace.sm),
                // The amount without the currency word, as the column header says.
                Text(_plain(receipt.lines[i].amount), style: context.text.labelLarge),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

/// [amount] with thousands separators and no currency word, such as "28,000".
String _plain(int amount) => ugx(amount).replaceFirst('UGX ', '');
