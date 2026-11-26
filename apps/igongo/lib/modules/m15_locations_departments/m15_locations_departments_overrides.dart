// The hand-made screens of module 15 (Organisation), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 15's hand-made screens.
final m15Overrides = recordScreens(place, {
  'S15-01': list(),
  'S15-02': list(types: ['department']),
  'S15-03': list(types: ['location']),
  'S15-04': list(types: ['outlet']),
  'S15-05': list(types: ['cost_centre']),
});
