// The hand-made screens of module 16, by screen number. Every other screen
// of the module uses a shared layout from its kind.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_card/my_card_screen.dart';

/// Module 16's hand-made screens.
final m16Overrides = <String, ScreenOverride>{'S16-19': (_, s) => MyCardScreen(s)};
