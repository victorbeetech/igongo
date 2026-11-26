// The hand-made screens of module 66 (Delivery & Riders), live from the API.
// Dispatch and zones are on the web portal; the guest's tracker (S66-10) and the
// rider screens are here; every other screen uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/dispatch_board_screen.dart';
import 'presentation/my_deliveries_screen.dart';
import 'presentation/rider_home_screen.dart';

/// Module 66's hand-made screens.
final m66Overrides = <String, ScreenOverride>{
  for (final id in ['S66-03', 'S66-04', 'S66-05', 'S66-06', 'S66-07', 'S66-08', 'S66-09'])
    id: (_, s) => RiderHomeScreen(s),
  'S66-10': (_, s) => MyDeliveriesScreen(s),
  'S66-01': (_, s) => DispatchBoardScreen(s),
};
