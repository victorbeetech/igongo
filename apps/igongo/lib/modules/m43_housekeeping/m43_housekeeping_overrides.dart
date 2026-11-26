// The hand-made screens of module 43 (Housekeeping), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 43's hand-made screens.
final m43Overrides = recordScreens(place, {
  'S43-01': list(types: ['room']),
  'S43-02': list(types: ['room']),
  'S43-03': list(types: ['clean'], assigned: true),
  'S43-04': list(types: ['clean'], assigned: true),
  'S43-05': list(types: ['clean']),
  'S43-06': list(types: ['clean']),
  'S43-07': list(canAdd: false),
});
