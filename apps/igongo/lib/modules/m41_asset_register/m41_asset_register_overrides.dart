// The hand-made screens of module 41 (Assets), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 41's hand-made screens.
final m41Overrides = recordScreens(place, {
  'S41-01': list(types: ['asset']),
  'S41-02': scan(),
  'S41-03': scan(),
  'S41-04': form(types: ['asset']),
  'S41-05': list(types: ['count']),
  'S41-06': list(canAdd: false),
});
