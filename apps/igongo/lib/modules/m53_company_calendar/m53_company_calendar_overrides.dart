// The hand-made screens of module 53 (Company calendar), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 53's hand-made screens.
final m53Overrides = recordScreens(place, {
  'S53-01': list(canAdd: false),
  'S53-02': list(canAdd: false),
  'S53-03': form(),
  'S53-04': list(canAdd: false),
});
