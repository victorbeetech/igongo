// Live record data for the shared record screens (Riverpod), one family per module place or list filter.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/records_api.dart';
import '../domain/record_config.dart';
import '../domain/record_event.dart';
import '../domain/record_place.dart';
import '../domain/record_query.dart';
import '../domain/work_record.dart';

/// The records API.
final recordsApiProvider = Provider<RecordsApi>((ref) => RecordsApi(ref.watch(apiClientProvider)));

/// A module's set-up; reloads when the session changes.
final recordConfigProvider = FutureProvider.autoDispose.family<RecordConfig, RecordPlace>((ref, place) {
  ref.watch(sessionProvider);
  return ref.watch(recordsApiProvider).config(place);
});

/// A list of records.
final recordListProvider = FutureProvider.autoDispose.family<List<WorkRecord>, RecordQuery>((ref, q) {
  ref.watch(sessionProvider);
  return ref.watch(recordsApiProvider).list(q);
});

/// One record and its history, by (place, id).
final recordProvider = FutureProvider.autoDispose.family<(WorkRecord, List<RecordEvent>), (RecordPlace, String)>((
  ref,
  key,
) {
  ref.watch(sessionProvider);
  return ref.watch(recordsApiProvider).one(key.$1, key.$2);
});
