// One item in the cart: a rounded card with a large photo, the name, its
// options, the date the guest wants it, the price, the quantity +/- control
// and a delete button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/hotel_day.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/guest_photo.dart';
import '../../domain/cart_line.dart';
import 'quantity_stepper.dart';

/// One cart line as a shadowed card.
class CartItemCard extends StatelessWidget {
  /// Creates the card for [line].
  const CartItemCard({
    super.key,
    required this.line,
    required this.onQuantity,
    required this.onDelete,
    required this.onDate,
  });

  /// The line shown.
  final CartLine line;

  /// Called with the new quantity when the +/- buttons change it.
  final ValueChanged<int> onQuantity;

  /// Called when the delete button is tapped.
  final VoidCallback onDelete;

  /// Called when the date is tapped, to choose another day.
  final VoidCallback onDate;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final date = line.date;
    // Step 1: the rounded card with a soft shadow, drawn from theme tokens only.
    return Container(
      margin: const EdgeInsets.only(bottom: IgongoSpace.md),
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        boxShadow: [BoxShadow(color: palette.text.withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 2: the large photo on the left.
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            child: SizedBox(width: 104, height: 104, child: GuestPhoto(label: line.name)),
          ),
          const SizedBox(width: IgongoSpace.md),
          // Step 3: the name, the options, the date and the price, then the quantity and delete row.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(line.name, style: context.text.titleMedium, maxLines: 2, overflow: TextOverflow.ellipsis),
                if (line.options.isNotEmpty)
                  Text(
                    _optionWords(line.options),
                    style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                // The guest's note for the kitchen, when there is one.
                if (line.notes case final note?)
                  Text('Note: $note', style: context.text.bodySmall?.copyWith(color: palette.textMuted), maxLines: 2, overflow: TextOverflow.ellipsis),
                // Step 3a: the day, tappable to choose another (a line from a reorder may have none yet).
                InkWell(
                  onTap: onDate,
                  borderRadius: BorderRadius.circular(IgongoRadius.sm),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: IgongoSpace.xs),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.calendar_today_outlined, size: 16, color: palette.textMuted),
                        const SizedBox(width: IgongoSpace.xs),
                        Flexible(
                          child: Text(
                            date == null ? 'Choose a date' : dayWords(date),
                            style: context.text.bodySmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Step 3b: the price of the line.
                Text(
                  ugx(line.lineTotal),
                  style: context.text.titleSmall?.copyWith(color: palette.primaryText, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: IgongoSpace.sm),
                // Step 3c: quantity on the left, delete on the right.
                Row(
                  children: [
                    QuantityStepper(quantity: line.quantity, onChanged: onQuantity),
                    const Spacer(),
                    IconButton(
                      tooltip: 'Remove ${line.name}',
                      icon: Icon(Icons.delete_outline, color: palette.primary),
                      onPressed: onDelete,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// The options as readable words, such as "Large, Extra cheese".
/// Options are stored as `group:choice` keys, so only the choice is shown.
String _optionWords(List<String> options) =>
    options.map((o) => statusWords(o.split(':').last.replaceAll('-', '_'))).join(', ');
