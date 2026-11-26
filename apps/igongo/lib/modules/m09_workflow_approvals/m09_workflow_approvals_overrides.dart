// The hand-made screens of module 9 (Approvals), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 9's hand-made screens.
final m09Overrides = recordScreens(place, {
  'S09-01': list(types: ['approval']),
  'S09-03': list(types: ['delegation']),
  'S09-04': form(types: ['approval']),
  'S09-05': list(),
});
