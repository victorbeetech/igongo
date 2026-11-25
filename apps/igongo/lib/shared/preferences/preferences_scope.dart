// Puts the AppPreferences above the whole app so any screen can read them
// with `PreferencesScope.of(context)` and redraw when they change.

import 'package:material_ui/material_ui.dart';

import 'app_preferences.dart';

/// Shares [AppPreferences] with every widget below it.
class PreferencesScope extends InheritedNotifier<AppPreferences> {
  /// Wraps [child] with the given preferences.
  const PreferencesScope({super.key, required AppPreferences preferences, required super.child})
    : super(notifier: preferences);

  /// The preferences, and a rebuild of the caller when they change.
  static AppPreferences of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<PreferencesScope>()!.notifier!;
}
