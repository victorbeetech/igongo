// Faults & Maintenance live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/faults_api.dart';
import '../domain/fault.dart';
import '../domain/fault_page.dart';

/// The Faults API on the app's client.
final faultsApiProvider = Provider((ref) => FaultsApi(ref.watch(apiClientProvider)));

/// My faults: reported by me (false) or given to me to fix (true).
final myFaultsProvider = FutureProvider.autoDispose.family<List<Fault>, bool>((ref, assigned) {
  ref.watch(sessionProvider);
  return ref.watch(faultsApiProvider).mine(assigned: assigned);
});

/// One fault, by ID.
final faultProvider = FutureProvider.autoDispose.family<FaultPage, String>((ref, id) {
  ref.watch(sessionProvider);
  return ref.watch(faultsApiProvider).fault(id);
});
