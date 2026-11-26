// The guest's own profile for My account (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/crm_api.dart';
import '../domain/guest_profile.dart';

/// The guest profile API on the app's client.
final crmApiProvider = Provider((ref) => CrmApi(ref.watch(apiClientProvider)));

/// My profile; reloads when the session changes.
final myProfileProvider = FutureProvider.autoDispose<GuestProfile>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(crmApiProvider).me();
});
