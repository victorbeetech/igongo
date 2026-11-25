// A pre-made role and its home tiles. Roles are data: the super admin edits
// them, and the app builds each home from them at run time.

import 'role_tile.dart';

/// One pre-made role.
class RoleSpec {
  /// Creates a role. Only the generator calls this.
  const RoleSpec({required this.key, required this.name, required this.level, required this.tiles});

  /// The role key, such as super-admin.
  final String key;

  /// The role name, such as Super Admin.
  final String name;

  /// The level group, such as Department managers.
  final String level;

  /// The tiles on this role's home.
  final List<RoleTile> tiles;

  /// Whether the role is a guest or client role (they see the client app).
  bool get isClient => level == 'Guests and clients';

  /// The module codes this role's tiles reach, used to build its menu.
  Set<String> get modules => {for (final t in tiles) t.screenId.substring(1, 3)};
}
