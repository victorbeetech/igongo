// The hand-made screens of module 33 (Performance), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 33's hand-made screens.
final m33Overrides = recordScreens(place, {
  'S33-01': list(types: ['appraisal'], mine: true, canAdd: false),
  'S33-02': list(types: ['appraisal']),
  'S33-03': list(types: ['appraisal']),
  'S33-04': list(types: ['goal']),
  'S33-05': list(types: ['probation']),
  'S33-06': list(canAdd: false),
});
