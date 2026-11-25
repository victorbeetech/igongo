// What the API answers when the app registers its push token.

/// The API's answer to a token registration.
class DeviceRegistration {
  /// Creates the answer.
  const DeviceRegistration({required this.topics});

  /// The broadcast topics this device should join, chosen by the API from the
  /// person's roles, such as `all`, `clients` or `staff`.
  ///
  /// The app never picks topics itself: anyone can join a topic from a phone,
  /// so topics only carry broadcasts that are safe for everyone in them.
  /// Messages for one role go to that role's tokens from the API instead.
  final List<String> topics;
}
