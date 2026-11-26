// The hand-made screens of module 42 (Tasks), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 42's hand-made screens.
final m42Overrides = recordScreens(place, {
  'S42-01': list(assigned: true),
  'S42-02': list(),
  'S42-03': form(),
  'S42-04': list(),
  'S42-05': list(canAdd: false),
});
