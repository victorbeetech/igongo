// The hand-made screens of module 57 (Loyalty), live from the API.
// S57-01 is the guest's points wallet (My points); the others use the shared
// record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import ../../shared/catalog/catalog.dart;
import ../../shared/records/presentation/record_screens.dart;
import domain/place.dart;
import points/presentation/my_points_screen.dart;

/// Module 57's hand-made screens.
final m57Overrides = <String, ScreenOverride>{
  ...recordScreens(place, {
    'S57-02': list(types: ['member'], mine: true, canAdd: false),
    'S57-03': list(types: ['reward'], canAdd: false),
    'S57-04': list(types: ['member']),
    'S57-05': list(canAdd: false),
  }),
  // My points: the live wallet, not the old records list.
  'S57-01': (_, s) => const MyPointsScreen(),
};
