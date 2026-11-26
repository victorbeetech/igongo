// The guest home's pictures, from one place. Each value is null until a
// picture exists, and a plain placeholder shows meanwhile. A value may be an
// image address (https://...) or an asset path. To add an asset: put the file
// in apps/igongo/assets/photos/ and list the folder under `flutter: assets:`
// in pubspec.yaml. Later the super admin will change the banner (wait list).
//
// Pictures the hotel must send:
//  * banner: the owner's round thatched hut (now set: assets/photos/igongo-hut.jpg).
//  * food: a plate of the restaurant's food (wide, 3:2).
//  * roomStandard, roomDeluxe, roomExecutive: one photo of each room type (wide, 3:2).

import 'package:material_ui/material_ui.dart';

/// Where each guest-home picture lives (null shows the placeholder).
abstract final class GuestPhotos {
  /// The banner at the top of the guest home.
  static const String banner = 'assets/photos/igongo-hut.jpg';

  /// Which part of the banner photo stays in view when it is cropped wide
  /// (a little above centre keeps the thatch and the door).
  static const Alignment bannerAlignment = Alignment(0, -0.3);

  /// The photo on the Food shop card.
  static const String? food = null;

  /// Room photos for the room booking screens (not shown yet: the screens use
  /// placeholders until these are set and the screens read them).
  static const String? roomStandard = null;

  /// The deluxe room photo.
  static const String? roomDeluxe = null;

  /// The executive room photo.
  static const String? roomExecutive = null;
}
