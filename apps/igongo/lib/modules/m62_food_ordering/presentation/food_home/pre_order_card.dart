// The pre-order card for tomorrow's special. The API has no pre-order yet, so
// the card shows its layout with a placeholder dish and price, and a note that
// pre-order is coming soon. It takes no orders.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The Tomorrow's special card, with placeholder content.
class PreOrderCard extends StatelessWidget {
  /// Creates the card.
  const PreOrderCard({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    // Step 1: a soft card with the special's label and a Pre-order tag.
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: p.primaryText, shape: BoxShape.circle),
              ),
              const SizedBox(width: IgongoSpace.xs),
              Expanded(
                child: Text(
                  "TOMORROW'S SMOKEHOUSE SPECIAL",
                  style: text.labelMedium?.copyWith(fontWeight: FontWeight.w700, color: p.primaryText),
                ),
              ),
              DecoratedBox(
                decoration: BoxDecoration(color: p.border, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                  child: Text('Pre-order', style: text.labelSmall?.copyWith(color: p.text)),
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.sm),
          // Step 2: placeholder dish name and price (the API has no pre-order yet).
          Text('Coming soon', style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text)),
          const SizedBox(height: IgongoSpace.xxs),
          Text(
            'Pre-order for tomorrow will appear here once the kitchen opens it.',
            style: text.bodySmall?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text('UGX —', style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.primaryText)),
        ],
      ),
    );
  }
}
