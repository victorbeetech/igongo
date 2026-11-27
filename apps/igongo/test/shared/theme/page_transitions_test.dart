// Checks that every platform uses the same soft fade page transition, set once in the theme.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  test('light and dark themes use the soft fade on every platform', () {
    for (final theme in [IgongoTheme.light, IgongoTheme.dark]) {
      final builders = theme.pageTransitionsTheme.builders;
      // Step 1: every platform has a builder, so none falls back to the default swipe.
      for (final platform in TargetPlatform.values) {
        expect(builders[platform], isA<FadeUpwardsPageTransitionsBuilder>(), reason: '$platform');
      }
    }
  });
}
