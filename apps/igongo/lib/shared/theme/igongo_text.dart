// The Igongo type scale from the tokens: Cinzel for brand moments, Lato for
// everything else, small by default. People scale it in Settings.

import 'package:igongo_brand/igongo_brand.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Builds the text theme for a mode, mapping each token style to Material's names.
TextTheme igongoTextTheme(Color text, Color muted) {
  // Step 1: turn one token record into a text style in the right font.
  TextStyle style(({double size, double height, int weight, bool brand}) t, {Color? colour}) => TextStyle(
    fontFamily: t.brand ? IgongoFonts.brand : IgongoFonts.body,
    package: BrandAssets.package,
    fontSize: t.size,
    height: t.height / t.size,
    fontWeight: FontWeight.values[(t.weight ~/ 100) - 1],
    color: colour ?? text,
    letterSpacing: t.brand ? 0.6 : 0,
  );
  // Step 2: map the Igongo names (display, headline, title, ...) to Material's slots.
  return TextTheme(
    displayLarge: style(IgongoType.display),
    displayMedium: style(IgongoType.display),
    displaySmall: style(IgongoType.display),
    headlineMedium: style(IgongoType.headline),
    headlineSmall: style(IgongoType.headline),
    titleLarge: style(IgongoType.headline),
    titleMedium: style(IgongoType.title),
    titleSmall: style(IgongoType.subtitle),
    bodyLarge: style(IgongoType.body),
    bodyMedium: style(IgongoType.body),
    bodySmall: style(IgongoType.caption, colour: muted),
    labelLarge: style(IgongoType.label),
    labelMedium: style(IgongoType.label),
    labelSmall: style(IgongoType.caption),
  );
}
