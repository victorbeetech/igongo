// The signed-in person, as the app needs them: their session token, who
// they are and what their roles let them do (from `GET /api/access/me`).

/// A signed-in person.
class Session {
  /// Creates a session.
  const Session({
    required this.token,
    required this.userId,
    required this.name,
    this.email = '',
    this.displayId = '',
    required this.isStaff,
    required this.permissions,
    required this.roleKeys,
  });

  /// The Bearer token for every API call.
  final String token;

  /// The person's account ID.
  final String userId;

  /// The person's name.
  final String name;

  /// The person's sign-in email.
  final String email;

  /// The short profile number the server gives, zero-padded (for example `00001`).
  /// Empty until the account has loaded.
  final String displayId;

  /// True for staff; clients see the guest app.
  final bool isStaff;

  /// Permission keys with `*` wildcards, such as `attendance.*.view`.
  final List<String> permissions;

  /// The keys of the person's roles, such as `gatekeeper`.
  final List<String> roleKeys;

  /// True for the super admin, who alone may use the Preview panel.
  bool get isSuperAdmin => roleKeys.contains('super-admin');

  /// True when one of the person's permissions covers [required]
  /// (`module.feature.action`; the same rule as the API's matcher).
  bool can(String required) {
    final need = required.split('.');
    return permissions.any((granted) {
      if (granted == '*') return true;
      final have = granted.split('.');
      if (have.length != 3 || need.length != 3) return false;
      return [for (var i = 0; i < 3; i++) have[i] == '*' || have[i] == need[i]].every((ok) => ok);
    });
  }
}
