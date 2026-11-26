// The guest home's pictures, from one place. Each value is null until a
// picture exists, and a plain placeholder shows meanwhile. A value may be an
// image address (https://...) or an asset path. To add an asset: put the file
// in apps/igongo/assets/photos/ and list the folder under `flutter: assets:`
// in pubspec.yaml. Later the super admin will change the banner (wait list).
//
// Pictures the hotel must send:
//  * banner: the owner's round thatched hut (now set: assets/photos/igongo-hut.jpg).
//  * food: set (assets/photos/food-dish.jpg, a placeholder dish from the owner).
//  * roomStandard, roomDeluxe: set. roomExecutive: still needed (a bedroom, not a meeting room).

import 'package:material_ui/material_ui.dart';

/// Where each guest-home picture lives (null shows the placeholder).
abstract final class GuestPhotos {
  /// The banner at the top of the guest home.
  static const String banner = 'assets/photos/igongo-hut.jpg';

  /// Which part of the banner photo stays in view when it is cropped wide
  /// (a little above centre keeps the thatch and the door).
  static const Alignment bannerAlignment = Alignment(0, -0.3);

  /// The photo on the Food shop card.
  static const String food = 'assets/photos/food-dish.jpg';

  /// Room photos for the room booking screens (not shown yet: the screens use
  /// placeholders until these are set and the screens read them).
  static const String roomStandard = 'assets/photos/room-standard.jpg';

  /// The deluxe room photo.
  static const String roomDeluxe = 'assets/photos/room-deluxe.jpg';

  /// The executive room photo.
  static const String? roomExecutive = null;

  /// The restaurant outlet's photo (shown on the demo outlet's shop row; real
  /// outlets have no photo field yet).
  static const String outletRestaurant = 'assets/photos/outlet-restaurant.jpg';
}
