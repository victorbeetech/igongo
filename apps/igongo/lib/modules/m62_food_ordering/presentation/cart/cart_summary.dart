// The cart summary: subtotal, any discount, the service charge and the total.
// The subtotal, discount and total come from the server's quote (the app never
// decides a price). The service charge is a PLACEHOLDER line until the super
// admin's service charge is built (docs/WAIT-LIST.md, item 8).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../application/cart_quote_provider.dart';
import '../../domain/cart_line.dart';
import '../../domain/cart_quote.dart';
import '../../domain/service_charge_placeholder.dart';

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
    // Step 2: the app never works out a price; until the server answers, or when it
    // cannot, the amounts show as a dash.
    String amount(int? value) => value == null ? '—' : ugx(value);
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
          _Row(label: 'Subtotal', value: loading ? '…' : amount(quote?.subtotal)),
          if (quote != null && quote.discount > 0) ...[
            const SizedBox(height: IgongoSpace.sm),
            _Row(label: quote.promoLabel ?? 'Discount', value: '− ${ugx(quote.discount)}'),
          ],
          const SizedBox(height: IgongoSpace.sm),
          // PLACEHOLDER service charge line (see domain/service_charge_placeholder.dart); not calculated yet.
          _Row(
            label: 'Service charge ($serviceChargeRatePlaceholder%)',
            value: ugx(serviceChargeAmountPlaceholder),
          ),
          const SizedBox(height: IgongoSpace.md),
          Divider(color: palette.border, height: 1),
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the total, in the brand red, from the server.
          _Row(label: 'Total', value: loading ? '…' : amount(quote?.total), big: true),
          // Step 5: say why a total could not be worked out, or that it waits for a choice at checkout.
          if (!loading && quote == null && !failed) ...[
            const SizedBox(height: IgongoSpace.sm),
            Text(
              'Your total is worked out at checkout, with the delivery fee and any code.',
              style: context.text.bodySmall?.copyWith(color: palette.textMuted),
            ),
          ],
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
  const _Row({required this.label, required this.value, this.big = false});

  /// The left-hand words.
  final String label;

  /// The right-hand value.
  final String value;

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
        Text(value, style: style),
      ],
    );
  }
}
