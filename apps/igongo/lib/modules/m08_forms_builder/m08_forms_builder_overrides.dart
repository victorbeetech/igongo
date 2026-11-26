// The hand-made screens of module 8 (Forms), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 8's hand-made screens.
final m08Overrides = recordScreens(place, {
  'S08-01': list(),
  'S08-04': list(canAdd: false),
  'S08-06': list(),
  'S08-07': form(),
  'S08-08': list(),
  'S08-09': list(),
  'S08-10': form(),
});
