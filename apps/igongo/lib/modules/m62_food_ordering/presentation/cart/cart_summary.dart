// The cart summary: the subtotal of the lines, the service charge and the
// total. The server sets the final service charge and total at checkout (the
// app never decides a price), so those rows say so instead of guessing.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/cart_line.dart';

/// The totals card for [lines].
class CartSummary extends StatelessWidget {
  /// Creates the summary.
  const CartSummary({super.key, required this.lines});

  /// The cart's lines.
  final List<CartLine> lines;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the subtotal is the sum of each line's price times its count.
    final subtotal = lines.fold<int>(0, (sum, l) => sum + l.lineTotal);
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        boxShadow: [BoxShadow(color: palette.text.withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          // Step 2: subtotal, then the service charge, which the server adds at checkout.
          _Row(label: 'Subtotal', value: ugx(subtotal)),
          const SizedBox(height: IgongoSpace.sm),
          _Row(label: 'Service charge', value: 'Added at checkout', muted: true),
          const SizedBox(height: IgongoSpace.md),
          Divider(color: palette.border, height: 1),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the total, in the brand red.
          _Row(label: 'Total', value: ugx(subtotal), big: true),
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
