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

/// One promotion slide: a photo and which part stays in view when cropped.
class PromoPhoto {
  /// Creates a promotion slide.
  const PromoPhoto(this.asset, [this.alignment = Alignment.center]);

  /// The photo's asset path or address.
  final String asset;

  /// The part of the photo kept in view.
  final Alignment alignment;
}

/// Where each guest-home picture lives (null shows the placeholder).
abstract final class GuestPhotos {
  /// The banner at the top of the guest home.
  static const String banner = 'assets/photos/igongo-hut.jpg';

  /// The two promotion slides behind the greeting (the hut is the new-promo slide).
  static const List<PromoPhoto> promos = [
    PromoPhoto(banner, bannerAlignment),
    PromoPhoto('assets/photos/hotel-entrance-night.jpg'),
  ];

  /// Which part of the banner photo stays in view when it is cropped wide
  /// (a little above centre keeps the thatch and the door).
  static const Alignment bannerAlignment = Alignment(0, -0.3);

  /// The photo on the Food shop card.
  static const String food = 'assets/photos/food-fish.jpg';

  /// Room photos for the room booking screens (not shown yet: the screens use
  /// placeholders until these are set and the screens read them).
  static const String roomStandard = 'assets/photos/room-standard.jpg';

  /// The deluxe room photo.
  static const String roomDeluxe = 'assets/photos/room-deluxe.jpg';

  /// The executive room photo.
  static const String? roomExecutive = null;

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

  /// The ring gate sign at the entrance.
  static const String hotelGateSign = 'assets/photos/hotel-gate-sign.jpg';

  /// The cattle statue on its lawn, seen from the path.
  static const String hotelCattleStatueFar = 'assets/photos/hotel-cattle-statue-far.jpg';

  /// The cottage court gate and its sign.
  static const String hotelCottageGate = 'assets/photos/hotel-cottage-gate.jpg';

  /// The Amaarwa beer museum display (cultural section).
  static const String hotelBeerMuseum = 'assets/photos/hotel-beer-museum.jpg';

  /// The cultural centre museum desk.
  static const String hotelMuseumDesk = 'assets/photos/museum-desk.jpg';

  /// The reception desk.
  static const String hotelReception = 'assets/photos/hotel-reception.jpg';

  /// A plated fish dish at night.
  static const String foodFishPlated = 'assets/photos/food-fish-plated.jpg';

  /// A plated salmon fillet with risotto and asparagus (a demo dish picture).
  static const String foodDish = 'assets/photos/food-dish.jpg';

  /// The hotel lit up with fairy lights at night.
  static const String hotelNightLights = 'assets/photos/hotel-night-lights.jpg';

  /// A bathroom with a glass shower.
  static const String roomBathroomShower = 'assets/photos/room-bathroom-shower.jpg';

  /// The lobby with the staircase and seating.
  static const String hotelLobby = 'assets/photos/hotel-lobby.jpg';

  /// The Kaahwa Kanuzire restaurant front, close up.
  static const String hotelKaahwaFront = 'assets/photos/hotel-kaahwa-front.jpg';

  /// A night view toward the hotel through the palms.
  static const String hotelNightView = 'assets/photos/hotel-night-view.jpg';

  /// The warrior statue in the cultural centre.
  static const String hotelWarriorStatue = 'assets/photos/hotel-warrior-statue.jpg';

  /// The hilltop monument arch.
  static const String hotelMonument = 'assets/photos/hotel-monument.jpg';

  /// The antelope statue in the garden.
  static const String hotelAntelope = 'assets/photos/hotel-antelope.jpg';
}
