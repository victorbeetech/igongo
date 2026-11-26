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
//  * hotel photos (entrance, cottages, gardens, cattle statue, cultural hut, pool, bathroom, restaurant): set from the owner's photos.

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

  /// The hotel building and its entrance steps.
  static const String hotelEntrance = 'assets/photos/hotel-entrance.jpg';

  /// The cottages and the paved walk between them.
  static const String hotelCottages = 'assets/photos/hotel-cottages.jpg';

  /// The gardens: trimmed hedges, palms and the cattle statue.
  static const String hotelGardens = 'assets/photos/hotel-gardens.jpg';

  /// The long-horned cattle statue close up.
  static const String hotelCattleStatue = 'assets/photos/hotel-cattle-statue.jpg';

  /// The cultural hut with its clay figures.
  static const String hotelCulturalHut = 'assets/photos/hotel-cultural-hut.jpg';

  /// The swimming pool.
  static const String hotelPool = 'assets/photos/hotel-pool.jpg';

  /// A room bathroom (for a room slot).
  static const String roomBathroom = 'assets/photos/room-bathroom.jpg';

  /// A grilled whole fish with chips (a real dish, for the Food list).
  static const String foodFish = 'assets/photos/food-fish.jpg';

  /// The Kaahwa Kanuzire restaurant (for the restaurant outlet).
  static const String hotelKaahwaKanuzire = 'assets/photos/hotel-kaahwa-kanuzire.jpg';

  /// The hotel entrance lit up at night (a home banner or Food option).
  static const String hotelEntranceNight = 'assets/photos/hotel-entrance-night.jpg';

  /// The city lights at night from the hotel (a home banner option).
  static const String hotelNightCity = 'assets/photos/hotel-night-city.jpg';

  /// The view from the terrace over the hills and the pool (a home banner option).
  static const String hotelTerraceView = 'assets/photos/hotel-terrace-view.jpg';

  /// The ring gate sign at the entrance.
  static const String hotelGateSign = 'assets/photos/hotel-gate-sign.jpg';

  /// The cattle statue on its lawn, seen from the path.
  static const String hotelCattleStatueFar = 'assets/photos/hotel-cattle-statue-far.jpg';

  /// The cottage court gate and its sign.
  static const String hotelCottageGate = 'assets/photos/hotel-cottage-gate.jpg';

  /// The Amaarwa beer museum display (cultural section).
  static const String hotelBeerMuseum = 'assets/photos/hotel-beer-museum.jpg';
}
