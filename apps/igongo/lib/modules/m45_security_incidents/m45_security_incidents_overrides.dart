// The hand-made screens of module 45 (Security), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 45's hand-made screens.
final m45Overrides = recordScreens(place, {
  'S45-01': list(),
  'S45-02': list(types: ['patrol']),
  'S45-03': list(types: ['incident']),
  'S45-04': form(types: ['incident']),
  'S45-05': list(types: ['incident']),
  'S45-06': form(types: ['panic']),
  'S45-07': list(canAdd: false),
});
