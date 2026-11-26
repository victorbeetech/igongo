// The hand-made screens of module 63 (Kitchen production), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/catalog/catalog.dart';
import '../../shared/orders_board/orders_board_screen.dart';
import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 63's hand-made screens.
final m63Overrides = <String, ScreenOverride>{
  // The kitchen sees new orders first; the expo screen sees ready ones.
  'S63-01': (_, s) => OrdersBoardScreen(s, status: 'received'),
  'S63-02': (_, s) => OrdersBoardScreen(s, status: 'ready'),
  ...recordScreens(place, {
    'S63-03': list(types: ['production']),
    'S63-04': list(types: ['waste']),
    'S63-05': list(canAdd: false),
  }),
};
