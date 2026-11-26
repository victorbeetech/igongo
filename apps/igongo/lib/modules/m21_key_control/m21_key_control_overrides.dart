// The hand-made screens of module 21 (Key control), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 21's hand-made screens.
final m21Overrides = recordScreens(place, {
  'S21-01': list(types: ['key']),
  'S21-02': scan(),
  'S21-03': scan(),
  'S21-04': scan(),
  'S21-05': list(types: ['key']),
  'S21-06': list(canAdd: false),
});
