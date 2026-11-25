// Starts the Igongo app.

import 'package:material_ui/material_ui.dart';

import 'app/igongo_app.dart';
import 'modules/m10_notifications/push_module.dart';

/// Runs the app.
Future<void> main() async {
  // Plugins (Firebase) need the engine ready before runApp().
  WidgetsFlutterBinding.ensureInitialized();

  // Push notifications: off, with no error, until this build has Firebase
  // settings (see apps/igongo/config/firebase-app.example.json).
  await PushModule.initialise();

  runApp(const IgongoApp());
}
