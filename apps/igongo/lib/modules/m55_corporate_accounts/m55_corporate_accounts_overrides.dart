// The hand-made screens of module 55 (Corporate accounts), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 55's hand-made screens.
final m55Overrides = recordScreens(place, {
  'S55-01': list(types: ['company']),
  'S55-02': list(types: ['company']),
  'S55-03': form(types: ['company']),
  'S55-04': list(mine: true, canAdd: false),
  'S55-05': list(canAdd: false),
});
