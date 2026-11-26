// The hand-made screens of module 51 (Meetings), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 51's hand-made screens.
final m51Overrides = recordScreens(place, {
  'S51-01': list(types: ['meeting']),
  'S51-02': list(types: ['meeting']),
  'S51-03': form(types: ['meeting']),
  'S51-04': list(types: ['meeting']),
  'S51-05': list(types: ['action'], assigned: true),
});
