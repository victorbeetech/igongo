// One module's screens, dialogs and sample data, as the generator writes them.

import 'dialog_spec.dart';
import 'module_mock.dart';
import 'screen_override.dart';
import 'screen_spec.dart';

/// One module: its folder, screens, dialogs and sample data.
class ModuleSpec {
  /// Creates a module description. Only the generator calls this.
  const ModuleSpec({
    required this.code,
    required this.name,
    required this.slug,
    required this.screens,
    required this.dialogs,
    required this.mock,
    this.overrides = const {},
  });

  /// The two-digit module code, such as 16.
  final String code;

  /// The module name.
  final String name;

  /// The folder and route name, such as staff-cards.
  final String slug;

  /// Every screen of the module.
  final List<ScreenSpec> screens;

  /// Every dialog of the module.
  final List<DialogSpec> dialogs;

  /// Sample data for the module's screens.
  final ModuleMock mock;

  /// Hand-made screens by screen number, for screens that need more than a shared layout.
  final Map<String, ScreenOverride> overrides;
}
