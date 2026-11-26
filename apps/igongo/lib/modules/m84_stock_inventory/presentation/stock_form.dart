// The shared parts of the app's stock forms: an item picker and a store picker.

import 'package:material_ui/material_ui.dart';

import '../domain/stock_item.dart';
import '../domain/stock_store.dart';

/// A drop-down of active items.
Widget itemPicker(List<StockItem> items, String? value, ValueChanged<String?> onChanged) =>
    DropdownButtonFormField<String>(
      initialValue: value,
      decoration: const InputDecoration(labelText: 'Item'),
      items: [
        for (final i in items.where((i) => i.active)) DropdownMenuItem(value: i.id, child: Text('${i.code} ${i.name}')),
      ],
      onChanged: onChanged,
    );

/// A drop-down of open stores; with [mineOnly], only those I may work in.
Widget storePicker(
  String label,
  List<StockStore> stores,
  String? value,
  ValueChanged<String?> onChanged, {
  bool mineOnly = true,
}) => DropdownButtonFormField<String>(
  initialValue: value,
  decoration: InputDecoration(labelText: label),
  items: [
    for (final s in stores.where((s) => s.active && (!mineOnly || s.mine)))
      DropdownMenuItem(value: s.id, child: Text(s.name)),
  ],
  onChanged: onChanged,
);
