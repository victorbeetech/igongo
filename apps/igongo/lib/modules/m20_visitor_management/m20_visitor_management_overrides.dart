// The hand-made screens of module 20 (Visitors), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 20's hand-made screens.
final m20Overrides = recordScreens(place, {
  'S20-01': list(types: ['visitor']),
  'S20-02': form(types: ['visitor']),
  'S20-03': form(types: ['visitor']),
  'S20-04': scan(),
  'S20-05': list(types: ['visitor']),
  'S20-06': list(types: ['contractor']),
  'S20-07': list(types: ['vehicle']),
  'S20-08': list(types: ['blacklist']),
  'S20-09': list(canAdd: false),
});
