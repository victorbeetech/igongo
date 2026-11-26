// The hand-made screens of module 23 (Recruitment), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 23's hand-made screens.
final m23Overrides = recordScreens(place, {
  'S23-01': list(types: ['vacancy']),
  'S23-03': list(types: ['vacancy'], canAdd: false),
  'S23-04': form(types: ['application']),
  'S23-05': list(types: ['application']),
  'S23-06': list(types: ['application']),
  'S23-07': list(types: ['interview']),
  'S23-08': list(types: ['interview']),
});
