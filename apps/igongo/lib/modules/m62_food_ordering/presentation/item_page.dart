// The page for one dish, opened by tapping it: a preview of the meal, then
// optional add-ons (such as a drink), then an optional note for the kitchen
// (such as "no tomatoes"), then Add to cart. Nothing here is compulsory except
// a group the restaurant itself marks "required" in its menu.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/photo/photo_slot.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../domain/cart_line.dart';
import '../domain/menu_item.dart';
import '../domain/option_group.dart';

/// Opens [item]'s page over the current screen (it has a Back arrow).
Future<void> openItemPage(BuildContext context, MenuItem item) =>
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ItemPage(item: item)));

/// The page for [item].
class ItemPage extends ConsumerStatefulWidget {
  /// Creates the page.
  const ItemPage({super.key, required this.item});

  /// The dish.
  final MenuItem item;

  @override
  ConsumerState<ItemPage> createState() => _ItemPageState();
}

class _ItemPageState extends ConsumerState<ItemPage> {
  int _quantity = 1;

  /// Picked choice keys per group.
  final Map<String, Set<String>> _picks = {};

  /// The guest's note for the kitchen on this dish.
  final _note = TextEditingController();

  @override
  void dispose() {
    _note.dispose();
    super.dispose();
  }

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

  /// Adds the dish to the cart, once every group the restaurant marked required has a pick.
  void _add() {
    final missing = widget.item.options.where((g) => g.required && (_picks[g.key]?.isEmpty ?? true));
    if (missing.isNotEmpty) return showIgongoToast(context, 'Pick ${missing.first.name}.');
    final note = _note.text.trim();
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
            note: note.isEmpty ? null : note,
          ),
        );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    return Scaffold(
      appBar: AppBar(title: Text(item.name, maxLines: 1, overflow: TextOverflow.ellipsis)),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              children: [
                // Step 1: the preview of the meal.
                ClipRRect(
                  borderRadius: BorderRadius.circular(IgongoRadius.lg),
                  child: const PhotoSlot(width: double.infinity, height: 200, icon: Icons.restaurant_outlined),
                ),
                const SizedBox(height: IgongoSpace.md),
                Text(item.name, style: context.text.titleLarge),
                Text(ugx(item.price), style: context.text.titleMedium?.copyWith(color: context.palette.primaryText)),
                if (item.description case final d?) ...[const SizedBox(height: IgongoSpace.sm), Text(d)],
                if (item.allergens.isNotEmpty) ...[
                  const SizedBox(height: IgongoSpace.sm),
                  Text('Contains: ${item.allergens.join(', ')}', style: context.text.bodySmall),
                ],
                // Step 2: the add-ons, such as a drink (optional unless the menu says required).
                for (final g in item.options) ...[
                  const SizedBox(height: IgongoSpace.lg),
                  Text('${g.name} (${g.required ? 'required' : 'optional'})', style: context.text.titleSmall),
                  const SizedBox(height: IgongoSpace.sm),
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
                // Step 3: the personal note, optional.
                const SizedBox(height: IgongoSpace.lg),
                Text('Make it yours (optional)', style: context.text.titleSmall),
                const SizedBox(height: IgongoSpace.sm),
                TextField(
                  controller: _note,
                  maxLength: 300,
                  maxLines: 2,
                  decoration: const InputDecoration(hintText: 'For example: no tomatoes'),
                ),
              ],
            ),
          ),
          // Step 4: how many, and Add to cart.
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(IgongoSpace.md),
              child: Row(
                spacing: IgongoSpace.sm,
                children: [
                  IconButton(
                    tooltip: 'Fewer',
                    icon: const Icon(Icons.remove),
                    onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
                  ),
                  Text('$_quantity'),
                  IconButton(
                    tooltip: 'More',
                    icon: const Icon(Icons.add),
                    onPressed: () => setState(() => _quantity++),
                  ),
                  Expanded(
                    child: IgongoButton(label: 'Add ${ugx(_unitPrice * _quantity)}', expand: true, onPressed: _add),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
