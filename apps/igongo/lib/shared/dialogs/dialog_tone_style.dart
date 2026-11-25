// The icon, colour and confirm words for each dialog tone, so every dialog
// of the same tone looks the same.

import 'package:material_ui/material_ui.dart';

import '../catalog/catalog.dart';
import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';

/// How a dialog of one tone looks.
class DialogToneStyle {
  const DialogToneStyle._(this.icon, this.colour, this.confirm, this.variant);

  /// Works out the style of [tone] from the theme.
  factory DialogToneStyle.of(BuildContext context, DialogTone tone) {
    final p = context.palette;
    // One style per tone: danger is red with a warning icon, warnings are amber.
    return switch (tone) {
      DialogTone.danger => DialogToneStyle._(
        Icons.warning_amber_rounded,
        p.error,
        'Yes, continue',
        ButtonVariant.danger,
      ),
      DialogTone.warning => DialogToneStyle._(Icons.report_problem_outlined, p.warning, 'OK', ButtonVariant.primary),
      DialogTone.sheet => DialogToneStyle._(Icons.tune, p.primaryText, 'Done', ButtonVariant.primary),
      DialogTone.confirm => DialogToneStyle._(Icons.help_outline, p.primaryText, 'Confirm', ButtonVariant.primary),
    };
  }

  /// The icon at the top.
  final IconData icon;

  /// The icon colour.
  final Color colour;

  /// The words on the confirm button.
  final String confirm;

  /// The confirm button variant.
  final ButtonVariant variant;
}
