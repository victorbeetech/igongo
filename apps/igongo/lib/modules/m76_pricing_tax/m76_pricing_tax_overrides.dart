// The hand-made screens of module 76 (Prices and taxes), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 76's hand-made screens.
final m76Overrides = recordScreens(place, {
  'S76-01': list(types: ['price_list']),
  'S76-02': list(types: ['tax']),
  'S76-03': list(types: ['discount']),
  'S76-04': list(),
});
