// Builds the light and dark Material themes from the Igongo tokens. Igongo red
// is identical in both; only backgrounds, surfaces, text and borders change.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import 'igongo_palette.dart';
import 'igongo_text.dart';

/// The Igongo themes for the app.
abstract final class IgongoTheme {
  /// The light theme.
  static final light = _build(IgongoPalette.light, Brightness.light);

  /// The dark theme.
  static final dark = _build(IgongoPalette.dark, Brightness.dark);

  static ThemeData _build(IgongoPalette p, Brightness brightness) {
    // Step 1: the Material colour scheme, straight from the palette.
    final scheme = ColorScheme(
      brightness: brightness,
      primary: p.primary,
      onPrimary: p.onPrimary,
      primaryContainer: p.primaryContainer,
      onPrimaryContainer: p.onPrimaryContainer,
      secondary: p.secondary,
      onSecondary: p.background,
      error: p.error,
      onError: p.onError,
      surface: p.surface,
      onSurface: p.text,
      onSurfaceVariant: p.textMuted,
      surfaceContainerHighest: p.surfaceAlt,
      surfaceContainerHigh: p.surfaceAlt,
      surfaceContainer: p.surface,
      surfaceContainerLow: p.surface,
      outline: p.outline, // Strong edges: switch tracks, field outlines (3:1).
      // Soft edges stay soft: dividers and card edges.
      outlineVariant: p.border,
    );
    final text = igongoTextTheme(p.text, p.textMuted);
    const radius = BorderRadius.all(Radius.circular(IgongoRadius.md));
    const minSize = Size(IgongoTouch.minimum, IgongoTouch.minimum);

    // Step 2: every component styled once here, so screens never style themselves.
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: p.background,
      textTheme: text,
      extensions: [p],
      dividerTheme: DividerThemeData(color: p.border, space: 1, thickness: 1),
      // The app bar is Igongo red in both modes: the brand never changes with the theme.
      appBarTheme: AppBarTheme(
        backgroundColor: p.primary,
        foregroundColor: p.onPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: text.titleMedium?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
      ),
      cardTheme: CardThemeData(
        color: p.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: radius,
          side: BorderSide(color: p.border),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: p.primary,
          foregroundColor: p.onPrimary,
          minimumSize: minSize,
          shape: const RoundedRectangleBorder(borderRadius: radius),
          textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: p.text,
          minimumSize: minSize,
          side: BorderSide(color: p.border),
          shape: const RoundedRectangleBorder(borderRadius: radius),
          textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w700),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: p.primaryText, minimumSize: minSize, textStyle: text.labelLarge),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: p.surfaceAlt,
        isDense: true,
        // Dense to keep forms compact, but never under the 48 tap target (accessibility test).
        constraints: const BoxConstraints(minHeight: IgongoTouch.preferred),
        labelStyle: text.labelLarge?.copyWith(color: p.textMuted),
        hintStyle: text.bodyMedium?.copyWith(color: p.textMuted),
        // Field outlines use the strong outline token (3:1), so every field can be found.
        border: OutlineInputBorder(
          borderRadius: radius,
          borderSide: BorderSide(color: p.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: radius,
          borderSide: BorderSide(color: p.outline),
        ),
        // The focus ring is red in light mode and cream in dark mode (primaryText).
        focusedBorder: OutlineInputBorder(
          borderRadius: radius,
          borderSide: BorderSide(color: p.primaryText, width: 2),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: p.surfaceAlt,
        selectedColor: p.primaryContainer,
        side: BorderSide(color: p.border),
        labelStyle: text.labelMedium,
        shape: const StadiumBorder(),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: p.surface,
        indicatorColor: p.primaryContainer,
        height: 60,
        labelTextStyle: WidgetStatePropertyAll(text.labelSmall),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(color: states.contains(WidgetState.selected) ? p.primaryText : p.textMuted),
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? p.onPrimary : null),
        trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? p.primary : null),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: p.surface,
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(IgongoRadius.lg))),
        titleTextStyle: text.titleMedium,
        contentTextStyle: text.bodyMedium,
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: p.surface,
        showDragHandle: true,
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(IgongoRadius.lg))),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: p.secondary,
        contentTextStyle: text.bodyMedium?.copyWith(color: p.background),
        shape: const RoundedRectangleBorder(borderRadius: radius),
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(color: p.primaryText),
      listTileTheme: ListTileThemeData(
        dense: true,
        iconColor: p.textMuted,
        titleTextStyle: text.titleSmall,
        subtitleTextStyle: text.bodySmall,
        minVerticalPadding: IgongoSpace.sm,
      ),
      drawerTheme: DrawerThemeData(backgroundColor: p.surface),
    );
  }
}
