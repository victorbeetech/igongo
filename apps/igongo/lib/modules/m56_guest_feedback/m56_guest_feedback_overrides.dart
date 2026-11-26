// The hand-made screens of module 56 (Feedback and complaints), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 56's hand-made screens.
final m56Overrides = recordScreens(place, {
  'S56-01': list(types: ['feedback']),
  'S56-02': list(),
  'S56-03': form(),
  'S56-04': list(types: ['complaint']),
  'S56-05': list(types: ['review']),
  'S56-06': list(),
  'S56-07': list(canAdd: false),
});
