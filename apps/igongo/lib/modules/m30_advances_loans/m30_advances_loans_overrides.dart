// The hand-made screens of module 30 (Advances & Loans), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/mine/my_advances_screen.dart';

/// Module 30's hand-made screens.
final m30Overrides = <String, ScreenOverride>{'S30-01': (_, s) => MyAdvancesScreen(s)};
