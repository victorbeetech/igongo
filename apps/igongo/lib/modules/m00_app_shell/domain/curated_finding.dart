// One curated finding on the search screen: a dish, a stay or a tour, with its
// picture, rating, text and price. Shown under "Curated Findings".

import 'discovery_kind.dart';

/// A dish, stay or tour the guest can look at from the search screen.
class CuratedFinding {
  /// Creates a finding.
  const CuratedFinding({
    required this.kind,
    required this.venue,
    required this.title,
    required this.description,
    required this.rating,
    required this.reviews,
    required this.tagline,
    required this.priceLabel,
    required this.price,
    required this.unit,
    required this.actionLabel,
    this.photo,
  });

  /// Food, stay or tour: sets the badge colour and icon.
  final DiscoveryKind kind;

  /// The place's name, in the small tag on the picture.
  final String venue;

  /// The finding's title.
  final String title;

  /// A short description (the card cuts it to two lines).
  final String description;

  /// The star rating, such as 4.9.
  final double rating;

  /// How many reviews the rating is based on.
  final int reviews;

  /// The words on the right of the rating, such as "Chef's special".
  final String tagline;

  /// "Price" for dishes and tours, "Rate" for stays.
  final String priceLabel;

  /// The amount in whole shillings.
  final int price;

  /// What the amount is for, such as "/night" (may be empty).
  final String unit;

  /// The words on the button, such as "Order Dish".
  final String actionLabel;

  /// The picture's asset path, or null for the placeholder.
  final String? photo;
}
