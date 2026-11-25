// S00-34 Theme setting: light, dark or follow the phone. Igongo red stays the
// same in every choice; only the background, text and borders change.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/preferences/preferences.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/card/igongo_card.dart';

/// The theme setting.
class ThemeScreen extends StatelessWidget {
  /// Creates the setting for [screen].
  const ThemeScreen(this.screen, {super.key});

  /// The setting's context.
  final ScreenContext screen;

  // Each choice: the mode, its name and the palette its preview uses.
  static const _choices = [
    (ThemeMode.light, 'Light', IgongoPalette.light),
    (ThemeMode.dark, 'Dark', IgongoPalette.dark),
    (ThemeMode.system, 'Follow the phone', null),
  ];

  @override
  Widget build(BuildContext context) {
    final prefs = PreferencesScope.of(context);
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        for (final (mode, label, palette) in _choices)
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, 0),
            child: IgongoCard(
              color: prefs.themeMode == mode ? context.palette.primaryContainer : null,
              onTap: () => prefs.themeMode = mode,
              child: Row(
                spacing: IgongoSpace.md,
                children: [
                  // A small preview of the mode: its background with the same red bar.
                  _MiniPreview(palette: palette ?? (context.isDark ? IgongoPalette.dark : IgongoPalette.light)),
                  Expanded(child: Text(label, style: context.text.titleSmall)),
                  if (prefs.themeMode == mode) Icon(Icons.check_circle, color: context.palette.primaryText),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

// A thumbnail of a screen in one mode: a red app bar on that mode's background.
class _MiniPreview extends StatelessWidget {
  const _MiniPreview({required this.palette});

  final IgongoPalette palette;

  @override
  Widget build(BuildContext context) => Container(
    width: 56,
    height: 72,
    decoration: BoxDecoration(
      color: palette.background,
      borderRadius: BorderRadius.circular(IgongoRadius.sm),
      border: Border.all(color: palette.border),
    ),
    child: Column(
      children: [
        Container(height: 14, color: palette.primary),
        const SizedBox(height: 8),
        for (final w in [40.0, 28.0, 36.0])
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Container(width: w, height: 5, color: palette.textMuted),
          ),
      ],
    ),
  );
}
