// Everything a screen layout needs to draw one screen: the screen, its
// module's sample data, its state and how to open the next screen.

import '../states/view_state.dart';
import 'module_spec.dart';
import 'role_spec.dart';
import 'screen_spec.dart';

/// The inputs for drawing one screen. The app's router builds it.
class ScreenContext {
  /// Creates the inputs for one screen.
  const ScreenContext({
    required this.spec,
    required this.module,
    required this.state,
    required this.role,
    required this.nameOf,
    required this.open,
  });

  /// The screen being drawn.
  final ScreenSpec spec;

  /// The module it belongs to, with its sample data.
  final ModuleSpec module;

  /// The state to show (normal, loading, empty and so on).
  final ViewState state;

  /// The role being shown, whose tiles and menu the screen uses.
  final RoleSpec role;

  /// The name of another screen or dialog by number, for link labels.
  final String Function(String id) nameOf;

  /// Opens a screen, a dialog or `home` by number.
  final void Function(String id) open;

  /// The screens this one leads to, without the role home.
  List<String> get links => spec.opens.where((id) => id != 'home').toList();
}
