// The shortcuts under every staff home: approvals, the notice board, the
// client view switch and the panic button. Guests do not see them.

/// One shortcut: its words and the screen or dialog it opens.
class RoleShortcut {
  /// Creates a shortcut.
  const RoleShortcut(this.label, this.targetId);

  /// The words on the shortcut.
  final String label;

  /// The screen or dialog it opens.
  final String targetId;

  /// The shortcuts every staff role has, as the role spec says.
  static const staff = [
    RoleShortcut('Approvals inbox', 'S00-30'),
    RoleShortcut('Notice board', 'S49-01'),
    RoleShortcut('Switch to client view', 'D00-02'),
    RoleShortcut('Panic button', 'S00-24'),
  ];
}
