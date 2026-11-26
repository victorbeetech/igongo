// The hand-made screens of module 57 (Loyalty), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 57's hand-made screens.
final m57Overrides = recordScreens(place, {
  'S57-01': list(types: ['points'], mine: true, canAdd: false),
  'S57-02': list(types: ['member'], mine: true, canAdd: false),
  'S57-03': list(types: ['reward'], canAdd: false),
  'S57-04': list(types: ['member']),
  'S57-05': list(canAdd: false),
});
