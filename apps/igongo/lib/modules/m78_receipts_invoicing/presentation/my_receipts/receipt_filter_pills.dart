// The row of category pills above the list. One pill is selected at a time;
// "All" shows every receipt and carries the total count.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../../../shared/theme/theme.dart';
import '../../domain/receipt_category.dart';

/// Horizontal pills: All, then one per category.
class ReceiptFilterPills extends StatelessWidget {
  /// Creates the pills. [selected] is null for "All".
  const ReceiptFilterPills({super.key, required this.selected, required this.allCount, required this.onSelect});

  /// The selected category, or null for "All".
  final ReceiptCategory? selected;

  /// How many receipts "All" covers.
  final int allCount;

  /// Called with the tapped category, or null for "All".
  final ValueChanged<ReceiptCategory?> onSelect;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
    child: Row(
      spacing: IgongoSpace.sm,
      children: [
        _Pill(label: 'All ($allCount)', active: selected == null, onTap: () => onSelect(null)),
        for (final c in ReceiptCategory.values) _Pill(label: c.label, active: selected == c, onTap: () => onSelect(c)),
      ],
    ),
  );
}

/// One pill. The active pill is filled crimson; the others are quiet.
class _Pill extends StatelessWidget {
  /// Creates a pill with its [label].
  const _Pill({required this.label, required this.active, required this.onTap});

  /// The words on the pill.
  final String label;

  /// Whether this pill is the selected one.
  final bool active;

  /// Called when the pill is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      selected: active,
      label: label,
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
        onTap: onTap,
        child: AnimatedContainer(
          duration: Duration(milliseconds: IgongoMotion.standard.toInt()),
          constraints: const BoxConstraints(minHeight: IgongoTouch.minimum),
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.xs),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: active ? p.primary : p.surfaceAlt,
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
          ),
          child: Text(label, style: context.text.labelMedium?.copyWith(color: active ? p.onPrimary : p.text)),
        ),
      ),
    );
  }
}
