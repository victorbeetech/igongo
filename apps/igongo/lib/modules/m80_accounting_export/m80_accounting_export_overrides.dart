// The hand-made screens of module 80 (Accounting export), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 80's hand-made screens.
final m80Overrides = recordScreens(place, {
  'S80-01': list(types: ['batch']),
  'S80-02': list(types: ['mapping']),
});
