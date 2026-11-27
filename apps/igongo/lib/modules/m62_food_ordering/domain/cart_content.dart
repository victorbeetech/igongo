// The fixed content of the Cart screens: the banner slides and the popular
// services. Photos are placeholders until the owner supplies the hotel photos
// (set the asset path here, nothing else changes).

import 'cart_slide.dart';
import 'popular_service.dart';

/// The banner slides, in order. Each one is a service of the hotel.
const cartBannerSlides = <CartSlide>[
  CartSlide(title: 'Igongo Country Hotel'),
  CartSlide(title: 'Rooms'),
  CartSlide(title: 'Food'),
  CartSlide(title: 'Spa'),
  CartSlide(title: 'Events'),
];

/// The services shown under an empty cart, each opening its own screen.
const popularServices = <PopularService>[
  PopularService(label: 'Rooms', screenId: 'S67-01'),
  PopularService(label: 'Food', screenId: 'S62-01'),
  PopularService(label: 'Spa', screenId: 'S72-01'),
  PopularService(label: 'Events', screenId: 'S69-01'),
];
