// The hand-made screens of module 78 (Receipts and invoices), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/catalog/catalog.dart';
import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';
import 'presentation/my_receipts/my_receipts_screen.dart';

/// Module 78's hand-made screens. S78-06 is the guest's My receipts, drawn by hand.
final m78Overrides = <String, ScreenOverride>{
  ...recordScreens(place, {
    'S78-01': list(),
    'S78-02': scan(),
    'S78-03': list(canAdd: false),
    'S78-04': list(canAdd: false),
    'S78-05': scan(),
  }),
  'S78-06': (_, s) => MyReceiptsScreen(s),
};
