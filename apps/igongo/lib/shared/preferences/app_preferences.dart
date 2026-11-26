// The person's display choices (theme, text size) and, in this prototype, the
// preview choices (role, screen state). A plain ChangeNotifier for now; it
// moves to Riverpod with the rest of the state in Phase 7.

import 'package:material_ui/material_ui.dart';

import '../states/view_state.dart';
import 'text_size.dart';

/// Display and preview choices that every screen listens to.
class AppPreferences extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;
  TextSize _textSize = TextSize.standard;
  String _roleKey = 'super-admin';
  ViewState _state = ViewState.normal;
  bool _clientView = false;
  bool _previewMode = false;

  /// Design review: the preview choices (role, screen state) apply without
  /// signing in. Only tests and review builds turn it on; in the real app the
  /// preview is for the super admin only (see ViewRules).
  bool get previewMode => _previewMode;
  set previewMode(bool value) => _update(() => _previewMode = value);

  /// Light, dark or follow the phone.
  ThemeMode get themeMode => _themeMode;

  /// The chosen text size. The phone's own text size is applied on top.
  TextSize get textSize => _textSize;

  /// The role whose home and menu are shown.
  String get roleKey => _roleKey;

  /// The state every screen shows (preview only).
  ViewState get state => _state;

  /// Whether a staff member is looking at the app as a guest sees it.
  bool get clientView => _clientView;

  /// Changes the theme and redraws the app.
  set themeMode(ThemeMode value) => _update(() => _themeMode = value);

  /// Changes the text size and redraws the app.
  set textSize(TextSize value) => _update(() => _textSize = value);

  /// Changes the role and redraws its home and menu.
  set roleKey(String value) => _update(() => _roleKey = value);

  /// Changes the previewed state on every screen.
  set state(ViewState value) => _update(() => _state = value);

  /// Switches the client view on or off.
  set clientView(bool value) => _update(() => _clientView = value);

  // Applies one change and tells every listener once.
  void _update(VoidCallback change) {
    change();
    notifyListeners();
  }
}
