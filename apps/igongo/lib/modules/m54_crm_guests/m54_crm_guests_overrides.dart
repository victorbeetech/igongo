// The hand-made screens of module 54 (Guest CRM), live from the API. The
// staff guest list is on the web portal; every other screen uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_account_screen.dart';

/// Module 54's hand-made screens.
final m54Overrides = <String, ScreenOverride>{
  for (final id in ['S54-05', 'S54-06', 'S54-07']) id: (_, s) => MyAccountScreen(s),
};
