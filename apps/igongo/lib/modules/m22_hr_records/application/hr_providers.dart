// HR Records' live data for the app's screens (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/hr_api.dart';
import '../domain/my_profile.dart';

/// The HR Records API on the app's client.
final hrApiProvider = Provider((ref) => HrApi(ref.watch(apiClientProvider)));

/// My staff record; reloads when the session changes.
final myProfileProvider = FutureProvider.autoDispose<MyProfile>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(hrApiProvider).me();
});
