// The hand-made screens of module 78 (Receipts and invoices), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 78's hand-made screens.
final m78Overrides = recordScreens(place, {
  'S78-01': list(),
  'S78-02': scan(),
  'S78-03': list(canAdd: false),
  'S78-04': list(canAdd: false),
  'S78-05': scan(),
  'S78-06': list(mine: true, canAdd: false),
});
