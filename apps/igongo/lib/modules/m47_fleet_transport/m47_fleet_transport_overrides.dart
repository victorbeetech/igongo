// The hand-made screens of module 47 (Fleet and transport), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 47's hand-made screens.
final m47Overrides = recordScreens(place, {
  'S47-01': list(types: ['vehicle']),
  'S47-02': list(types: ['trip']),
  'S47-03': list(types: ['trip'], mine: true),
  'S47-04': form(types: ['trip']),
  'S47-05': list(types: ['fuel']),
  'S47-06': list(canAdd: false),
});
