// The hand-made screens of module 46 (Lost and found), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 46's hand-made screens.
final m46Overrides = recordScreens(place, {
  'S46-01': list(types: ['found']),
  'S46-02': form(types: ['found']),
  'S46-03': list(),
  'S46-04': form(types: ['lost']),
  'S46-05': list(canAdd: false),
});
