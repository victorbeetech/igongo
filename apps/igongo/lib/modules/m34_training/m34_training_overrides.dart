// The hand-made screens of module 34 (Training), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 34's hand-made screens.
final m34Overrides = recordScreens(place, {
  'S34-01': list(types: ['request'], mine: true),
  'S34-02': list(types: ['course']),
  'S34-03': list(types: ['course'], canAdd: false),
  'S34-04': list(types: ['session']),
  'S34-05': list(types: ['certificate']),
  'S34-06': list(canAdd: false),
});
