// Maps a receipt category to its icon, so every card and the empty state use one set.

import 'package:material_ui/material_ui.dart';

import '../../domain/receipt_category.dart';

/// The icon that stands for [category] on receipt cards.
IconData receiptCategoryIcon(ReceiptCategory category) => switch (category) {
  ReceiptCategory.dining => Icons.restaurant,
  ReceiptCategory.stays => Icons.cottage,
  ReceiptCategory.tours => Icons.museum,
  ReceiptCategory.wellness => Icons.spa,
};
