// One push notification as the app sees it, whatever service delivered it.
//
// The API sends every push with the same small data block (see the API's
// `modules/notifications/domain/push-payload.ts`), so the app can read it the
// same way in the foreground, in the background and after a tap.

/// A push notification received by the app.
class PushMessage {
  /// Creates a message. Use [PushMessage.fromData] for messages from the API.
  const PushMessage({
    required this.id,
    required this.title,
    required this.body,
    required this.channelId,
    this.link,
    this.data = const {},
  });

  /// Reads a message from the title, body and data block of a push.
  ///
  /// [id] falls back to the delivery ID the push service gives, so every
  /// message can still be shown once and only once.
  factory PushMessage.fromData({
    required String deliveryId,
    String? title,
    String? body,
    required Map<String, String> data,
  }) {
    return PushMessage(
      id: data['notificationId'] ?? deliveryId,
      title: title ?? data['title'] ?? '',
      body: body ?? data['body'] ?? '',
      channelId: data['channel'] ?? 'general',
      link: safeLink(data['link']),
      data: data,
    );
  }

  /// The notification ID from the API, used for read receipts and the inbox.
  final String id;

  /// The heading shown on the phone.
  final String title;

  /// The text shown under the heading.
  final String body;

  /// Which notification channel it belongs to (see `PushChannel`).
  final String channelId;

  /// The app screen to open when the person taps it, such as `/tasks/42`.
  final String? link;

  /// Every value the API sent with the push.
  final Map<String, String> data;

  /// Keeps only links to screens inside the app.
  ///
  /// A push must never open an outside web page or a crafted URL, so only a
  /// plain path that starts with one `/` is kept. Anything else is dropped and
  /// the tap just opens the inbox.
  static String? safeLink(String? link) {
    if (link == null || !link.startsWith('/') || link.startsWith('//')) return null;
    if (link.contains('://') || link.contains('\\')) return null;
    return link;
  }
}
