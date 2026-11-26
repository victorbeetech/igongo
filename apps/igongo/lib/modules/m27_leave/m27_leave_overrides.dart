// The hand-made screens of module 27 (Leave), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 27's hand-made screens.
final m27Overrides = recordScreens(place, {
  'S27-01': list(mine: true),
  'S27-02': form(),
  'S27-03': list(),
  'S27-04': list(),
  'S27-05': list(canAdd: false),
});
