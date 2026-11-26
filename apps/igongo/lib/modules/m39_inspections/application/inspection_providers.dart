// Inspections live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/inspections_api.dart';
import '../domain/due_checkup.dart';

/// The Inspections API on the app's client.
final inspectionsApiProvider = Provider((ref) => InspectionsApi(ref.watch(apiClientProvider)));

/// Today's checkups.
final dueCheckupsProvider = FutureProvider.autoDispose<List<DueCheckup>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(inspectionsApiProvider).today();
});
