// Which menu section (tab) the guest has picked on the food screen. Null means
// the first section of the menu.

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// The chosen section tab.
class MenuSection extends Notifier<String?> {
  @override
  String? build() => null;

  /// Picks the section named [section] (for example "Grill").
  void pick(String section) => state = section;
}

/// The section tab the guest picked, or null for the first.
final menuSectionProvider = NotifierProvider<MenuSection, String?>(MenuSection.new);
