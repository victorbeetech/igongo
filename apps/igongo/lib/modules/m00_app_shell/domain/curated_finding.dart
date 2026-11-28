// One curated finding on the search screen: a dish, a stay or a tour, with its
// picture, rating, text and price. Shown under "Curated Findings".

import '../../../shared/hotel/domain/hotel_content_item.dart';
import 'discovery_kind.dart';

/// A dish, stay or tour the guest can look at from the search screen.
class CuratedFinding {
  /// Creates a finding.
  const CuratedFinding({
    required this.venue,
    required this.title,
    required this.description,
    required this.priceLabel,
    required this.unit,
    required this.actionLabel,
    this.kind,
    this.rating,
    this.reviews,
    this.tagline,
    this.price,
    this.photo,
  });

  /// Builds a finding from the super admin's content item. The admin sends a name and
  /// a subtitle only, so the rating, price, tagline and kind stay empty (shown as a dash).
  factory CuratedFinding.fromContent(HotelContentItem item) => CuratedFinding(
    venue: item.subtitle,
    title: item.title,
    description: '',
    priceLabel: 'Price',
    unit: '',
    actionLabel: 'Open',
  );

  /// Food, stay or tour: sets the badge colour and icon. Null until the admin sets a kind.
  final DiscoveryKind? kind;

  /// The place's name, in the small tag on the picture.
  final String venue;

  /// The finding's title.
  final String title;

  /// A short description (the card cuts it to two lines).
  final String description;

  /// The star rating, such as 4.9. Null until there are reviews.
  final double? rating;

  /// How many reviews the rating is based on. Null when there are none yet.
  final int? reviews;

  /// The words on the right of the rating, such as "Chef's special". Null when not set.
  final String? tagline;

  /// "Price" for dishes and tours, "Rate" for stays.
  final String priceLabel;

  /// The amount in whole shillings. Null until the price is set; the card shows a dash.
  final int? price;

  /// What the amount is for, such as "/night" (may be empty).
  final String unit;

  /// The words on the button, such as "Order Dish".
  final String actionLabel;

  /// The picture's asset path, or null for the placeholder.
  final String? photo;
}
