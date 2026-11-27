// The fixed content of the Cart screens: the banner slides and the popular
// services. Each slide's photo comes from GuestPhotos.

import '../../../shared/ui/photo/guest_photos.dart';
import 'cart_slide.dart';
import 'popular_service.dart';

/// The banner slides, in order. Each one is a service of the hotel, with a
/// photo from the owner's set (see GuestPhotos).
const cartBannerSlides = <CartSlide>[
  CartSlide(title: 'Igongo Country Hotel', asset: GuestPhotos.hotelEntrance),
  CartSlide(title: 'Rooms', asset: GuestPhotos.roomDeluxe),
  CartSlide(title: 'Food', asset: GuestPhotos.foodFish),
  CartSlide(title: 'Spa', asset: GuestPhotos.hotelPool),
  CartSlide(title: 'Events', asset: GuestPhotos.hotelTerraceView),
];

/// The services shown under an empty cart, each opening its own screen.
const popularServices = <PopularService>[
  PopularService(label: 'Rooms', screenId: 'S67-01'),
  PopularService(label: 'Food', screenId: 'S62-01'),
  PopularService(label: 'Spa', screenId: 'S72-01'),
  PopularService(label: 'Events', screenId: 'S69-01'),
];
