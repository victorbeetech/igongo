// The sheet for one dish: how many and which options, then "Add to order".

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../domain/cart_line.dart';
import '../domain/menu_item.dart';
import '../domain/option_group.dart';
import 'parts/photo_placeholder.dart';

/// The options sheet for [item].
class ItemSheet extends ConsumerStatefulWidget {
  /// Creates the sheet.
  const ItemSheet({super.key, required this.item});

  /// The dish.
  final MenuItem item;

  @override
  ConsumerState<ItemSheet> createState() => _ItemSheetState();
}

class _ItemSheetState extends ConsumerState<ItemSheet> {
  int _quantity = 1;

  /// The guest's note for the kitchen on this dish.
  final _note = TextEditingController();

  @override
  void dispose() {
    _note.dispose();
    super.dispose();
  }

  /// Picked choice keys per group.
  final Map<String, Set<String>> _picks = {};

  /// The price of one, with the picked options.
  int get _unitPrice {
    var price = widget.item.price;
    for (final g in widget.item.options) {
      for (final c in g.choices) {
        if (_picks[g.key]?.contains(c.key) ?? false) price += c.priceDelta;
      }
    }
    return price;
  }

  /// Picks or unpicks [choice] in [group] (one only unless the group allows several).
  void _toggle(OptionGroup group, String choice) => setState(() {
    final set = _picks.putIfAbsent(group.key, () => {});
    if (set.contains(choice)) {
      set.remove(choice);
    } else {
      if (!group.multiple) set.clear();
      set.add(choice);
    }
  });

  /// Adds the dish to the cart once every required group has a pick.
  void _add() {
    final missing = widget.item.options.where((g) => g.required && (_picks[g.key]?.isEmpty ?? true));
    if (missing.isNotEmpty) return showIgongoToast(context, 'Pick ${missing.first.name}.');
    ref
        .read(cartProvider.notifier)
        .add(
          CartLine(
            itemId: widget.item.id,
            name: widget.item.name,
            quantity: _quantity,
            options: [
              for (final e in _picks.entries)
                for (final c in e.value) '${e.key}:$c',
            ],
            unitPrice: _unitPrice,
            notes: _note.text.trim().isEmpty ? null : _note.text.trim(),
          ),
        );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(IgongoSpace.lg),
    child: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          // The photo area (a placeholder when the dish has no photo).
          AspectRatio(
            aspectRatio: 16 / 10,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(IgongoSpace.md),
              child: PhotoPlaceholder(url: widget.item.photoUrl, icon: Icons.fastfood),
            ),
          ),
          Text(widget.item.name, style: context.text.titleLarge),
          if (widget.item.description case final d?) Text(d),
          if (widget.item.allergens.isNotEmpty)
            Text('Contains: ${widget.item.allergens.join(', ')}', style: context.text.bodySmall),
          for (final g in widget.item.options) ...[
            Text('${g.name}${g.required ? ' (required)' : ''}', style: context.text.titleSmall),
            Wrap(
              spacing: IgongoSpace.sm,
              children: [
                for (final c in g.choices)
                  FilterChip(
                    label: Text(c.priceDelta == 0 ? c.name : '${c.name} +${ugx(c.priceDelta)}'),
                    selected: _picks[g.key]?.contains(c.key) ?? false,
                    onSelected: (_) => _toggle(g, c.key),
                  ),
              ],
            ),
          ],
          Row(
            children: [
              const Expanded(child: Text('How many')),
              IconButton(
                tooltip: 'Fewer',
                icon: const Icon(Icons.remove),
                onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
              ),
              Text('$_quantity'),
              IconButton(tooltip: 'More', icon: const Icon(Icons.add), onPressed: () => setState(() => _quantity++)),
            ],
          ),
          // The note for the kitchen (for example "no onions").
          IgongoField(label: 'Note for the kitchen', controller: _note),
          IgongoButton(label: 'Add ${ugx(_unitPrice * _quantity)}', expand: true, onPressed: _add),
        ],
      ),
    ),
  );
}
