// The shortcuts under every staff home: approvals and the notice board.
// There is no client view switch: one account is one kind (approved access
// model). Guests do not see them.

/// One shortcut: its words and the screen or dialog it opens.
class RoleShortcut {
  /// Creates a shortcut.
  const RoleShortcut(this.label, this.targetId);

  /// The words on the shortcut.
  final String label;

  /// The screen or dialog it opens.
  final String targetId;

  /// The shortcuts every staff role has, as the role spec says.
  static const staff = [RoleShortcut('Approvals inbox', 'S00-30'), RoleShortcut('Notice board', 'S49-01')];
}
