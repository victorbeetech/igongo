// Short ways for widgets to read the theme: `context.palette`, `context.text`.

import 'package:material_ui/material_ui.dart';

import 'igongo_palette.dart';

/// Theme shortcuts on [BuildContext].
extension IgongoThemeContext on BuildContext {
  /// Every Igongo token colour for the current mode.
  IgongoPalette get palette => Theme.of(this).extension<IgongoPalette>()!;

  /// The Igongo text styles.
  TextTheme get text => Theme.of(this).textTheme;

  /// Whether the dark theme is showing.
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
}
