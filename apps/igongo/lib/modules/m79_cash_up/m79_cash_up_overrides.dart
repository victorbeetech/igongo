// The hand-made screens of module 79 (Cash-up), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 79's hand-made screens.
final m79Overrides = recordScreens(place, {
  'S79-01': form(types: ['cashup']),
  'S79-02': list(types: ['cashup']),
  'S79-03': list(types: ['cashup']),
  'S79-04': form(types: ['float']),
  'S79-05': list(canAdd: false),
});
