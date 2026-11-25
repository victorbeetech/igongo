// Whether the person lets the app show notifications.

/// The phone's notification permission for this app.
enum PushPermission {
  /// Notifications are allowed.
  granted,

  /// iOS only: notifications arrive quietly in the notification centre.
  provisional,

  /// The person said no. The app keeps working and the inbox still fills.
  denied,

  /// The person has not been asked yet.
  notDetermined;

  /// True when notifications will reach the phone.
  bool get allowsPush => this == granted || this == provisional;

  /// True when the app may still ask. Once refused, only the phone's settings
  /// can turn notifications back on, so the app must not keep asking.
  bool get isUndecided => this == notDetermined;
}
