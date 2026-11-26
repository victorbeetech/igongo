// The hand-made screens of module 36 (Staff requests and welfare), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 36's hand-made screens.
final m36Overrides = recordScreens(place, {
  'S36-01': list(types: ['request'], mine: true),
  'S36-02': form(types: ['request']),
  'S36-03': list(types: ['request']),
  'S36-04': list(types: ['welfare']),
  'S36-05': list(canAdd: false),
});
