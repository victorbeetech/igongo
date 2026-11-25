// The signature of a hand-made screen that replaces a shared layout.

import 'package:flutter/widgets.dart';

import 'screen_context.dart';

/// Builds a hand-made screen that replaces the shared layout for one screen.
typedef ScreenOverride = Widget Function(BuildContext context, ScreenContext screen);
