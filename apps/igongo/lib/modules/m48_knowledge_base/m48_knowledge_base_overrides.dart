// The hand-made screens of module 48 (Knowledge base), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 48's hand-made screens.
final m48Overrides = recordScreens(place, {
  'S48-01': list(canAdd: false),
  'S48-02': list(canAdd: false),
  'S48-03': list(),
  'S48-04': list(canAdd: false),
});
