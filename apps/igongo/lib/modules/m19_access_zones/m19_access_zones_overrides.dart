// The hand-made screens of module 19 (Access zones), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 19's hand-made screens.
final m19Overrides = recordScreens(place, {
  'S19-01': list(types: ['zone']),
  'S19-03': list(canAdd: false),
  'S19-04': list(types: ['entry']),
  'S19-05': form(types: ['entry']),
  'S19-06': list(types: ['entry']),
  'S19-07': list(types: ['pass']),
});
