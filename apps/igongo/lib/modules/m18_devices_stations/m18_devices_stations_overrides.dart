// The hand-made screens of module 18 (Devices), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 18's hand-made screens.
final m18Overrides = recordScreens(place, {
  'S18-01': list(types: ['device']),
  'S18-02': scan(),
  'S18-03': form(types: ['device']),
  'S18-04': scan(),
  'S18-05': list(types: ['station']),
  'S18-06': list(types: ['station']),
  'S18-07': list(types: ['device']),
  'S18-08': list(types: ['station']),
  'S18-09': list(types: ['alert']),
  'S18-10': list(canAdd: false),
});
