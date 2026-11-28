// One choice on the Filter & Refine screen: a category, a sort order, an
// amenity or a zone. Its label is what people read; the icon sits beside it,
// and the detail is the small line under a zone.

import 'package:material_ui/material_ui.dart';

/// One choice the guest can tick, pick or sort by.
@immutable
class RefineOption {
  /// Creates a choice. [selected] is whether it starts ticked or picked.
  const RefineOption({required this.label, this.icon, this.detail, this.selected = false});

  /// The words shown for the choice.
  final String label;

  /// The picture drawn beside the label, if the choice has one.
  final IconData? icon;

  /// A short line under the label (used by zones), if any.
  final String? detail;

  /// Whether the choice starts ticked or picked.
  final bool selected;
}
