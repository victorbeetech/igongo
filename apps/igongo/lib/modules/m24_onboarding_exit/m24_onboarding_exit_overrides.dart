// The hand-made screens of module 24 (Onboarding and exit), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 24's hand-made screens.
final m24Overrides = recordScreens(place, {
  'S24-01': list(types: ['onboarding']),
  'S24-02': list(types: ['onboarding']),
  'S24-03': list(types: ['onboarding'], mine: true, canAdd: false),
  'S24-04': list(types: ['exit']),
  'S24-05': list(types: ['exit']),
  'S24-06': list(types: ['exit']),
  'S24-07': list(canAdd: false),
});
