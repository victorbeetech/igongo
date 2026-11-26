// Who the app draws itself for. The real person always wins:
// - signed in: their own role (from the server), and screens in their real state;
// - signed out: the guest side;
// - the super admin may switch on the design preview (any role, any screen
//   state, the sample layouts) from the Preview panel. Nobody else ever can;
//   the screen tests switch it on to draw every design.

import '../../shared/catalog/catalog.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/session/session.dart';
import '../../shared/states/view_state.dart';
import '../catalog/catalog_index.dart';

/// The rules, as plain functions.
abstract final class ViewRules {
  /// Roles that every account also has; a more specific role is shown first.
  static const _baseRoles = {'staff-base', 'guest'};

  /// Whether [session] may open the Preview panel.
  static bool canPreview(AppPreferences prefs, Session? session) =>
      prefs.previewMode || (session?.isSuperAdmin ?? false);

  /// Whether the design preview (role, state, sample layouts) applies for [session].
  /// A signed-in account that is not the super admin never gets it.
  static bool previewOn(AppPreferences prefs, Session? session) =>
      prefs.previewMode && (session == null || session.isSuperAdmin);

  /// The role whose home and menu show.
  static RoleSpec role(AppPreferences prefs, Session? session) {
    final roles = CatalogIndex.instance.roles;
    if (previewOn(prefs, session)) return roles[prefs.roleKey] ?? CatalogIndex.instance.defaultRole;
    if (session == null) return roles['guest']!;
    if (session.isSuperAdmin) return roles['super-admin'] ?? CatalogIndex.instance.defaultRole;
    // The person's most specific role the app knows, else their base role.
    final known = session.roleKeys.where(roles.containsKey).toList();
    final key = known.firstWhere((k) => !_baseRoles.contains(k), orElse: () => known.isEmpty ? 'guest' : known.first);
    return roles[key]!;
  }

  /// The state every screen shows: the previewed one for the super admin, else normal.
  static ViewState state(AppPreferences prefs, Session? session) =>
      previewOn(prefs, session) ? prefs.state : ViewState.normal;
}
