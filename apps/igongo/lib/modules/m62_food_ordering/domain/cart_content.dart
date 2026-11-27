// The fixed content of the Cart screens: the banner slides and the popular
// services. Each slide's photo is an asset path from assets/photos/ (the same
// files GuestPhotos lists); a slide with no asset shows the placeholder.

import 'cart_slide.dart';
import 'popular_service.dart';

/// The banner slides, in order. Each one is a service of the hotel.
const cartBannerSlides = <CartSlide>[
  CartSlide(title: 'Igongo Country Hotel', asset: 'assets/photos/hotel-entrance.jpg'),
  CartSlide(title: 'Rooms', asset: 'assets/photos/room-deluxe.jpg'),
  CartSlide(title: 'Food', asset: 'assets/photos/food-fish.jpg'),
  CartSlide(title: 'Spa', asset: 'assets/photos/hotel-pool.jpg'),
  CartSlide(title: 'Events', asset: 'assets/photos/hotel-gardens.jpg'),
];

/// The services shown under an empty cart, each opening its own screen.
const popularServices = <PopularService>[
  PopularService(label: 'Rooms', screenId: 'S67-01'),
  PopularService(label: 'Food', screenId: 'S62-01'),
  PopularService(label: 'Spa', screenId: 'S72-01'),
  PopularService(label: 'Events', screenId: 'S69-01'),
];
