// The hand-made screens of module 65 (Buffet), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 65's hand-made screens.
final m65Overrides = recordScreens(place, {
  'S65-01': list(types: ['session']),
  'S65-02': list(types: ['ticket']),
  'S65-03': list(),
  'S65-04': form(types: ['ticket']),
  'S65-05': list(canAdd: false),
});
