// The full Igongo palette as a theme extension, so screens read every token
// colour (success, warning, muted text, borders) from the theme, never a hex.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Every token colour for the current mode. Read it with `context.palette`.
@immutable
class IgongoPalette extends ThemeExtension<IgongoPalette> {
  /// Creates a palette. Use [light] or [dark].
  const IgongoPalette({
    required this.primary,
    required this.onPrimary,
    required this.primaryDark,
    required this.primaryContainer,
    required this.onPrimaryContainer,
    required this.primaryText,
    required this.secondary,
    required this.background,
    required this.surface,
    required this.surfaceAlt,
    required this.text,
    required this.textMuted,
    required this.border,
    required this.outline,
    required this.success,
    required this.warning,
    required this.error,
    required this.onError,
    required this.info,
    required this.brandCream,
  });

  /// Light mode. Igongo red is the same as in dark mode.
  static const light = IgongoPalette(
    primary: IgongoColorsLight.primary,
    onPrimary: IgongoColorsLight.onPrimary,
    primaryDark: IgongoColorsLight.primaryDark,
    primaryContainer: IgongoColorsLight.primaryContainer,
    onPrimaryContainer: IgongoColorsLight.onPrimaryContainer,
    primaryText: IgongoColorsLight.primaryText,
    secondary: IgongoColorsLight.secondary,
    background: IgongoColorsLight.background,
    surface: IgongoColorsLight.surface,
    surfaceAlt: IgongoColorsLight.surfaceAlt,
    text: IgongoColorsLight.text,
    textMuted: IgongoColorsLight.textMuted,
    border: IgongoColorsLight.border,
    outline: IgongoColorsLight.outline,
    success: IgongoColorsLight.success,
    warning: IgongoColorsLight.warning,
    error: IgongoColorsLight.error,
    onError: IgongoColorsLight.onError,
    info: IgongoColorsLight.info,
    brandCream: IgongoColorsLight.brandCream,
  );

  /// Dark mode. Only backgrounds, text, borders and status colours change.
  static const dark = IgongoPalette(
    primary: IgongoColorsDark.primary,
    onPrimary: IgongoColorsDark.onPrimary,
    primaryDark: IgongoColorsDark.primaryDark,
    primaryContainer: IgongoColorsDark.primaryContainer,
    onPrimaryContainer: IgongoColorsDark.onPrimaryContainer,
    primaryText: IgongoColorsDark.primaryText,
    secondary: IgongoColorsDark.secondary,
    background: IgongoColorsDark.background,
    surface: IgongoColorsDark.surface,
    surfaceAlt: IgongoColorsDark.surfaceAlt,
    text: IgongoColorsDark.text,
    textMuted: IgongoColorsDark.textMuted,
    border: IgongoColorsDark.border,
    outline: IgongoColorsDark.outline,
    success: IgongoColorsDark.success,
    warning: IgongoColorsDark.warning,
    error: IgongoColorsDark.error,
    onError: IgongoColorsDark.onError,
    info: IgongoColorsDark.info,
    brandCream: IgongoColorsDark.brandCream,
  );

  /// Igongo red: buttons, bars, badges and the logo.
  final Color primary;

  /// Text and icons on Igongo red.
  final Color onPrimary;

  /// Deep red: pressed states and the status bar.
  final Color primaryDark;

  /// Selected chips and highlighted cards.
  final Color primaryContainer;

  /// Text on [primaryContainer].
  final Color onPrimaryContainer;

  /// Links, highlighted words, and small red marks: icons, focus rings, chart
  /// bars and the scan ring. Cream in dark mode, where Igongo red is too dim
  /// (under 3:1) on the night background. Filled shapes still use [primary].
  final Color primaryText;

  /// Charcoal in light mode, cream in dark mode: second buttons and icons.
  final Color secondary;

  /// Screen background.
  final Color background;

  /// Cards, sheets and dialogs.
  final Color surface;

  /// Inputs, skeletons and quiet panels.
  final Color surfaceAlt;

  /// Main text.
  final Color text;

  /// Hints, captions and timestamps.
  final Color textMuted;

  /// Dividers and card edges (decorative, so they stay soft).
  final Color border;

  /// Field outlines: strong enough (3:1) to show where a field is.
  final Color outline;

  /// Paid, approved, on duty.
  final Color success;

  /// Late, pending, low.
  final Color warning;

  /// Failed, refused, overdue. Always shown with an icon, never by colour alone.
  final Color error;

  /// Text and icons on a filled error shape, such as the danger button.
  final Color onError;

  /// Tips and the client view banner.
  final Color info;

  /// The brand cream, for text on dark brand surfaces such as the staff card.
  final Color brandCream;

  @override
  IgongoPalette copyWith() => this;

  @override
  IgongoPalette lerp(IgongoPalette? other, double t) {
    // Step 1: no blend needed when there is nothing to blend towards.
    if (other == null) return this;
    // Step 2: blend every colour so the light and dark switch animates smoothly.
    Color mix(Color a, Color b) => Color.lerp(a, b, t)!;
    return IgongoPalette(
      primary: mix(primary, other.primary),
      onPrimary: mix(onPrimary, other.onPrimary),
      primaryDark: mix(primaryDark, other.primaryDark),
      primaryContainer: mix(primaryContainer, other.primaryContainer),
      onPrimaryContainer: mix(onPrimaryContainer, other.onPrimaryContainer),
      primaryText: mix(primaryText, other.primaryText),
      secondary: mix(secondary, other.secondary),
      background: mix(background, other.background),
      surface: mix(surface, other.surface),
      surfaceAlt: mix(surfaceAlt, other.surfaceAlt),
      text: mix(text, other.text),
      textMuted: mix(textMuted, other.textMuted),
      border: mix(border, other.border),
      outline: mix(outline, other.outline),
      success: mix(success, other.success),
      warning: mix(warning, other.warning),
      error: mix(error, other.error),
      onError: mix(onError, other.onError),
      info: mix(info, other.info),
      brandCream: mix(brandCream, other.brandCream),
    );
  }
}
