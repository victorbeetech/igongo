// Maps the icon keys the super admin picks (see HOME_ICON_KEYS in the API) to the
// Material icons the apps draw. An unknown key draws the star, so a new key never
// leaves an empty space.

import 'package:material_ui/material_ui.dart';

/// The icon for [key]; the star when the key is unknown.
IconData homeIconFor(String key) => switch (key) {
  'sunny' => Icons.sunny,
  'pool' => Icons.pool_outlined,
  'restaurant' => Icons.restaurant_outlined,
  'terrain' => Icons.terrain_outlined,
  'music' => Icons.music_note_outlined,
  'bar' => Icons.local_bar_outlined,
  'spa' => Icons.spa_outlined,
  'hotel' => Icons.hotel_outlined,
  'museum' => Icons.account_balance_outlined,
  'events' => Icons.event_outlined,
  'shop' => Icons.storefront_outlined,
  _ => Icons.star_outline,
};
