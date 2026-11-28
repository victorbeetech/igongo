// The middle of the ticket: the origin and service-gate row, the date, table
// and settlement row, then the manifest and totals.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../domain/guest_receipt.dart';
import 'ticket_manifest.dart';

/// The details of the receipt, between the two tear lines.
class TicketBody extends StatelessWidget {
  /// Creates the body for [receipt].
  const TicketBody({super.key, required this.receipt});

  /// The receipt to show.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the guest on the left, the service gate on the right.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: _Party(label: 'Origin / Guest', code: 'BRD', name: receipt.guestName, note: receipt.guestUnit),
              ),
              const SizedBox(width: IgongoSpace.md),
              Expanded(
                child: _Party(label: 'Service Gate', code: receipt.gateCode, name: receipt.outlet, note: receipt.place),
              ),
            ],
          ),
          // Step 2: the date, the table and the settlement state.
          Row(
            children: [
              Expanded(
                child: _Cell(label: 'Date & Time', value: _date(receipt), sub: _clock(receipt)),
              ),
              Expanded(
                child: _Cell(label: 'Table / Station', value: receipt.tableLabel, sub: 'Dine-In'),
              ),
              const Expanded(child: _Settled(label: 'SETTLED')),
            ],
          ),
          // Step 3: the manifest of items and the totals.
          TicketManifest(receipt: receipt),
          _Totals(receipt: receipt),
        ],
      ),
    );
  }
}

/// One side of the origin/gate row: a code tag, a label, a name and a note.
class _Party extends StatelessWidget {
  /// Creates the block.
  const _Party({required this.label, required this.code, required this.name, required this.note});

  /// The small label on top.
  final String label;

  /// The short code tag, such as "KHW".
  final String code;

  /// The name in bold.
  final String name;

  /// A small note under the name.
  final String note;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(label.toUpperCase(), style: context.text.labelSmall?.copyWith(color: p.textMuted)),
            ),
            Text(code, style: context.text.labelSmall),
          ],
        ),
        Text(name, style: context.text.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
        Text(
          note,
          style: context.text.bodySmall?.copyWith(color: p.textMuted),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

/// A plain label, value and sub-line cell.
class _Cell extends StatelessWidget {
  /// Creates the cell.
  const _Cell({required this.label, required this.value, required this.sub});

  /// The small label on top.
  final String label;

  /// The main value.
  final String value;

  /// The line under the value.
  final String sub;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label.toUpperCase(), style: context.text.labelSmall?.copyWith(color: context.palette.textMuted)),
      Text(value, style: context.text.labelLarge),
      Text(sub, style: context.text.bodySmall?.copyWith(color: context.palette.textMuted)),
    ],
  );
}

/// The settled badge in the third column of the date row.
class _Settled extends StatelessWidget {
  /// Creates the badge with [label].
  const _Settled({required this.label});

  /// The badge words.
  final String label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text('SETTLEMENT', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
        DecoratedBox(
          decoration: BoxDecoration(
            color: p.accent.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
            child: Text(label, style: context.text.labelSmall?.copyWith(color: p.text)),
          ),
        ),
      ],
    );
  }
}

/// The subtotal, the levy line and the total paid.
class _Totals extends StatelessWidget {
  /// Creates the totals for [receipt].
  const _Totals({required this.receipt});

  /// The receipt the totals belong to.
  final GuestReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final subtotal = receipt.amount - receipt.levy;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.xs,
      children: [
        Divider(color: p.border),
        Row(
          children: [
            Expanded(child: Text('Subtotal', style: context.text.bodySmall)),
            Text(ugx(subtotal), style: context.text.bodySmall),
          ],
        ),
        Row(
          children: [
            Expanded(child: Text('Hospitality Levy & VAT (18% incl.)', style: context.text.bodySmall)),
            Text(ugx(receipt.levy), style: context.text.bodySmall),
          ],
        ),
        // The total paid, with the method and transaction id on the left.
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: Text(
                'TOTAL FARE PAID\n${receipt.method} • TxID: ${receipt.transactionId}',
                style: context.text.bodySmall?.copyWith(color: p.textMuted),
              ),
            ),
            Text(ugx(receipt.amount), style: context.text.headlineSmall?.copyWith(color: p.primary)),
          ],
        ),
      ],
    );
  }
}

/// The date as "27 Nov 2026", from the receipt's time.
String _date(GuestReceipt r) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '${r.at.day} ${months[r.at.month - 1]} ${r.at.year}';
}

/// The time as "13:45 EAT" (the hotel's time zone).
String _clock(GuestReceipt r) =>
    '${r.at.hour.toString().padLeft(2, '0')}:${r.at.minute.toString().padLeft(2, '0')} EAT';
