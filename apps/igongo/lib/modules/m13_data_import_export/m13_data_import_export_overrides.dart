// The hand-made screens of module 13 (Data jobs), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 13's hand-made screens.
final m13Overrides = recordScreens(place, {
  'S13-02': list(),
  'S13-03': list(types: ['export']),
  'S13-04': list(),
  'S13-05': form(types: ['restore']),
});
