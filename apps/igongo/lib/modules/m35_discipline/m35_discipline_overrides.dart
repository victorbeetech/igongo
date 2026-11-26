// The hand-made screens of module 35 (Discipline), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 35's hand-made screens.
final m35Overrides = recordScreens(place, {
  'S35-01': list(),
  'S35-02': list(),
  'S35-03': form(),
  'S35-04': list(mine: true, canAdd: false),
  'S35-05': list(),
  'S35-06': list(canAdd: false),
});
