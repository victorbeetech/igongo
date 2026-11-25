// The hand-made screens of module 49 (Notice Board), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/board/notice_board_screen.dart';

/// Module 49's hand-made screens.
final m49Overrides = <String, ScreenOverride>{'S49-01': (_, s) => NoticeBoardScreen(s)};
