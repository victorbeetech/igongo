// The port that draws notifications on the phone itself, used on Android
// where pushes that arrive while the app is open are not shown by the system.

import '../../domain/push_channel.dart';
import '../../domain/push_message.dart';

/// Shows notifications from inside the app.
abstract interface class LocalNotifier {
  /// Creates the notification channels and starts listening for taps.
  /// [onTap] gets the message the person tapped.
  Future<void> initialise({required List<PushChannel> channels, required void Function(PushMessage) onTap});

  /// Shows [message] in its channel.
  Future<void> show(PushMessage message);
}
