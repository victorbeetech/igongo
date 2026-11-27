// The cart summary: subtotal, any discount, the service charge and the total.
// The numbers come from the server's quote (the app never decides a price).
// While the quote loads it shows dashes, and it explains a failed quote.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../application/cart_quote_provider.dart';
import '../../domain/cart_line.dart';
import '../../domain/cart_quote.dart';

/// The totals card for [lines], priced by the server.
class CartSummary extends ConsumerWidget {
  /// Creates the summary.
  const CartSummary({super.key, required this.lines});

  /// The cart's lines.
  final List<CartLine> lines;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final palette = context.palette;
    // Step 1: the server's quote, with its loading and error states.
    final async = ref.watch(cartQuoteProvider);
    final CartQuote? quote = async.valueOrNull;
    final loading = async.isLoading && quote == null;
    final failed = async.hasError && quote == null;
    // Step 2: until the server answers, the lines' own prices show (they are the same prices).
    final local = lines.fold<int>(0, (sum, l) => sum + l.lineTotal);
    final charge = quote?.serviceCharge;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        boxShadow: [BoxShadow(color: palette.text.withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          // Step 3: subtotal, then any discount, then the service charge.
          _Row(label: 'Subtotal', value: loading ? '…' : ugx(quote?.subtotal ?? local)),
          if (quote != null && quote.discount > 0) ...[
            const SizedBox(height: IgongoSpace.sm),
            _Row(label: quote.promoLabel ?? 'Discount', value: '− ${ugx(quote.discount)}'),
          ],
          const SizedBox(height: IgongoSpace.sm),
          _Row(
            label: 'Service charge',
            value: loading ? '…' : (charge == null ? 'Not set yet' : ugx(charge)),
            muted: charge == null,
          ),
          const SizedBox(height: IgongoSpace.md),
          Divider(color: palette.border, height: 1),
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the total, in the brand red, from the server.
          _Row(label: 'Total', value: loading ? '…' : ugx(quote?.total ?? local), big: true),
          // Step 5: say why a total could not be worked out.
          if (failed) ...[
            const SizedBox(height: IgongoSpace.sm),
            Text(
              'We could not work out the total. Check your connection and try again.',
              style: context.text.bodySmall?.copyWith(color: palette.error),
            ),
          ],
        ],
      ),
    );
  }
}

/// One label and value row of the summary.
class _Row extends StatelessWidget {
  /// Creates a row.
  const _Row({required this.label, required this.value, this.muted = false, this.big = false});

  /// The left-hand words.
  final String label;

  /// The right-hand value.
  final String value;

  /// Whether the value is a note, shown in the muted colour.
  final bool muted;

  /// Whether this is the total, shown larger and in red.
  final bool big;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final style = big
        ? context.text.titleLarge?.copyWith(color: palette.primaryText, fontWeight: FontWeight.w700)
        : context.text.bodyMedium;
    return Row(
      children: [
        Expanded(child: Text(label, style: big ? context.text.titleMedium : context.text.bodyMedium)),
        Text(value, style: muted ? context.text.bodySmall?.copyWith(color: palette.textMuted) : style),
      ],
    );
  }
}
