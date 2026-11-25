// The text size choices from the tokens: Compact to Extra large.

import 'package:igongo_tokens/igongo_tokens.dart';

/// One text size a person can pick in Settings.
enum TextSize {
  /// 0.92 times the standard size.
  compact('Compact', IgongoTextScale.compact),

  /// The default on phones.
  standard('Standard', IgongoTextScale.standard),

  /// The default on tablets.
  comfortable('Comfortable', IgongoTextScale.comfortable),

  /// The default on the kitchen display and gate kiosk.
  large('Large', IgongoTextScale.large),

  /// 1.5 times; every screen is checked at this size.
  extraLarge('Extra large', IgongoTextScale.extraLarge);

  const TextSize(this.label, this.scale);

  /// The name shown in Settings.
  final String label;

  /// How much bigger than standard the text is.
  final double scale;
}
