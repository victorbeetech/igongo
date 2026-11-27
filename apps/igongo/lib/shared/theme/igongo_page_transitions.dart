// The page transition used for every route on every platform.
// A soft fade with a small upward slide replaces the default left-to-right swipe.
// Applied once through the theme (pageTransitionsTheme), so no screen changes.

import 'package:material_ui/material_ui.dart';

/// The page transitions for the Igongo themes.
abstract final class IgongoPageTransitions {
  /// One builder per platform, all the same soft fade, so Android, iOS, web and desktop match.
  static final theme = PageTransitionsTheme(
    builders: {for (final platform in TargetPlatform.values) platform: const FadeUpwardsPageTransitionsBuilder()},
  );
}
