// The hand-made screens of module 37 (Petty cash), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 37's hand-made screens.
final m37Overrides = recordScreens(place, {
  'S37-01': list(types: ['claim'], mine: true),
  'S37-02': form(types: ['claim']),
  'S37-03': list(types: ['claim']),
  'S37-04': list(types: ['topup']),
  'S37-05': form(types: ['count']),
  'S37-06': list(canAdd: false),
});
