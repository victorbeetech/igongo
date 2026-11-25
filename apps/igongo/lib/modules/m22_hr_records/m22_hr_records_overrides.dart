// The hand-made screens of module 22 (HR Records), by screen number, live
// from the API. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_profile/my_profile_screen.dart';

/// Module 22's hand-made screens.
final m22Overrides = <String, ScreenOverride>{'S22-08': (_, s) => MyProfileScreen(s)};
