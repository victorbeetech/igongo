// What happened when the app tried to switch push notifications on.

/// The outcome of starting push notifications for a signed-in person.
enum PushStartResult {
  /// Push is on: the token is registered and the topics are joined.
  started,

  /// The person refused notifications. The in-app inbox still works.
  permissionDenied,

  /// This build has no Firebase settings yet (see docs/NEEDS-YOU.md).
  notConfigured,

  /// Something failed, such as no network. Push is retried at the next start.
  failed,
}
