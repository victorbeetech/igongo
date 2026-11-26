// The hand-made screens of module 44 (Laundry), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 44's hand-made screens.
final m44Overrides = recordScreens(place, {
  'S44-01': list(types: ['guest']),
  'S44-02': form(types: ['guest']),
  'S44-03': list(types: ['linen']),
  'S44-04': list(types: ['uniform']),
  'S44-05': list(canAdd: false),
});
