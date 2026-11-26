// The hand-made screens of module 39 (Inspections), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/due/checkups_due_screen.dart';

/// Module 39's hand-made screens.
final m39Overrides = <String, ScreenOverride>{'S39-01': (_, s) => CheckupsDueScreen(s)};
