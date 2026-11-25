// Runs when a push arrives while the app is in the background or closed.
//
// Firebase runs this in a separate, headless copy of the app, so it must be a
// top-level function and must start Firebase again itself.

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'firebase_config.dart';

/// Handles a background push.
///
/// The API always sends a `notification` block, so the phone itself shows the
/// banner and nothing has to be drawn here. The handler only has to exist (and
/// start Firebase) so data-only pushes, such as "refresh the inbox", are
/// received. Keep it short: the phone stops it after about 20 seconds.
@pragma('vm:entry-point')
Future<void> handleBackgroundPush(RemoteMessage message) async {
  final options = FirebaseConfig.current();
  if (options == null) return;
  await Firebase.initializeApp(options: options);
}
