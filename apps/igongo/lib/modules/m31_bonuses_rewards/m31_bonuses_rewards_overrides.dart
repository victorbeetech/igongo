// The hand-made screens of module 31 (Bonuses & Rewards), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/mine/my_rewards_screen.dart';

/// Module 31's hand-made screens.
final m31Overrides = <String, ScreenOverride>{'S31-01': (_, s) => MyRewardsScreen(s)};
