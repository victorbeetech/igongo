// The hand-made screens of module 60 (Guest requests), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 60's hand-made screens.
final m60Overrides = recordScreens(place, {
  'S60-01': form(),
  'S60-02': list(mine: true),
  'S60-03': list(),
  'S60-04': list(),
  'S60-05': list(canAdd: false),
});
