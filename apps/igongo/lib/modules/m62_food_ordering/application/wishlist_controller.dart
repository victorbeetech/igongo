// The guest's wishlist toggle on the Cart banner: a heart that is either saved
// or not. It lives in memory while the app runs (no server call yet).

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Holds whether the wishlist heart is on (true) or off (false).
class WishlistController extends Notifier<bool> {
  @override
  bool build() => false; // Step 1: nothing is saved when the app starts.

  /// Flips the heart: saved becomes unsaved, and the other way round.
  void toggle() => state = !state;
}

/// The wishlist heart's state, read and changed by the Cart banner.
final wishlistProvider = NotifierProvider<WishlistController, bool>(WishlistController.new);
