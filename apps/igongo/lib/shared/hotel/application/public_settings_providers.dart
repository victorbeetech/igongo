// Riverpod providers for the public settings. Screens watch these; invalidate
// [publicSettingsProvider] to re-read after the admin changes something.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/public_settings_api.dart';
import '../domain/public_settings.dart';

/// The public settings reader on the app's client.
final publicSettingsApiProvider = Provider((ref) => PublicSettingsApi(ref.watch(apiClientProvider)));

/// The public settings (hotel details and active banners), read from the API once per start.
final publicSettingsProvider = FutureProvider<PublicSettings>(
  (ref) => ref.watch(publicSettingsApiProvider).fetch(),
);
