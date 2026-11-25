// Which kind of device a push token belongs to.

/// The platform of a device token, sent to the API with the token.
enum PushPlatform {
  /// An Android phone or tablet.
  android,

  /// An iPhone or iPad.
  ios,

  /// A web browser (not used yet; the web portal shows the in-app inbox).
  web,
}
