// The hand-made screens of module 52 (Surveys and polls), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 52's hand-made screens.
final m52Overrides = recordScreens(place, {
  'S52-01': list(),
  'S52-02': form(),
  'S52-03': list(canAdd: false),
  'S52-04': list(),
});
