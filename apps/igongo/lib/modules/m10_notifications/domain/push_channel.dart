// The notification channels the app creates on Android.
//
// Android groups notifications into channels, and the person can mute each
// channel in the phone's settings. The API picks the channel for each push
// (the `channel` value in its data block). The IDs here must match the API's
// `modules/notifications/domain/push-channel.ts`.

/// How loudly a channel interrupts the person.
enum PushImportance {
  /// Sound and a pop-up banner, such as a security alert.
  high,

  /// Sound but no pop-up, such as a new task.
  normal,

  /// No sound, such as a daily digest.
  low,
}

/// One Android notification channel.
class PushChannel {
  /// Creates a channel description.
  const PushChannel({required this.id, required this.name, required this.description, required this.importance});

  /// The channel ID the API uses.
  final String id;

  /// The name the person sees in the phone's settings.
  final String name;

  /// What the channel is for, shown in the phone's settings.
  final String description;

  /// How loudly it interrupts.
  final PushImportance importance;

  /// Urgent work: security, panic button, faults and emergencies.
  static const urgent = PushChannel(
    id: 'urgent',
    name: 'Urgent alerts',
    description: 'Security, emergencies and urgent faults',
    importance: PushImportance.high,
  );

  /// Everyday work: tasks, approvals, orders, shifts and reports.
  static const work = PushChannel(
    id: 'work',
    name: 'Work',
    description: 'Tasks, approvals, orders, shifts and reports',
    importance: PushImportance.normal,
  );

  /// Chat, notice board posts and comments.
  static const messages = PushChannel(
    id: 'messages',
    name: 'Messages and notices',
    description: 'Chat, notice board posts and comments',
    importance: PushImportance.normal,
  );

  /// Bookings, orders and deliveries for guests.
  static const bookings = PushChannel(
    id: 'bookings',
    name: 'Bookings and orders',
    description: 'Your bookings, food orders and deliveries',
    importance: PushImportance.high,
  );

  /// Everything else, including offers and daily digests.
  static const general = PushChannel(
    id: 'general',
    name: 'General',
    description: 'Offers, news and daily summaries',
    importance: PushImportance.low,
  );

  /// Every channel, created once when push starts.
  static const all = [urgent, work, messages, bookings, general];

  /// The channel with [id], or [general] when the ID is unknown.
  static PushChannel byId(String id) => all.firstWhere((c) => c.id == id, orElse: () => general);
}
