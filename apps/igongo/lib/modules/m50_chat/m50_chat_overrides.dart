// The hand-made screens of module 50 (Chat), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/chats/chats_screen.dart';

/// Module 50's hand-made screens.
final m50Overrides = <String, ScreenOverride>{
  'S50-01': (_, s) => ChatsScreen(s),
  // Details open inside the screen above, so their numbers lead there too.
  'S50-02': (_, s) => ChatsScreen(s),
  'S50-03': (_, s) => ChatsScreen(s),
};
