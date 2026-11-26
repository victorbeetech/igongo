// The hand-made screens of module 26 (Shifts and rosters), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 26's hand-made screens.
final m26Overrides = recordScreens(place, {
  'S26-01': list(types: ['shift']),
  'S26-02': list(types: ['shift'], assigned: true, canAdd: false),
  'S26-03': list(canAdd: false),
  'S26-04': list(types: ['swap']),
  'S26-05': list(types: ['open_shift']),
});
