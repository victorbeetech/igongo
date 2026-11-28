// Placeholder words, pictures and prices for the search screen. The layout is
// final; these values are replaced by the search API when it is wired (recent
// searches, categories, curated findings, trending experiences and filters).

import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/photo/guest_photos.dart';
import '../../domain/curated_finding.dart';
import '../../domain/discovery_kind.dart';
import '../../domain/trending_experience.dart';
import '../../domain/trending_tone.dart';

/// Every placeholder the search screen shows, in one place.
abstract final class DiscoveryPlaceholders {
  /// The searches the guest made before (newest first).
  static const List<String> recentSearches = [
    'Grilled Tilapia',
    'Cottage Suite',
    'Ankole Museum',
    'Eshabwe',
  ];

  /// The category pills, with the icon each one shows.
  static const List<({String label, IconData icon})> categories = [
    (label: 'All', icon: Icons.travel_explore),
    (label: 'Rooms & Cottages', icon: Icons.bed),
    (label: 'Dining & Kitchen', icon: Icons.restaurant),
    (label: 'Cultural Tours', icon: Icons.temple_buddhist),
    (label: 'Wellness & Pool', icon: Icons.pool),
    (label: 'Gift Shop', icon: Icons.storefront),
  ];

  /// The filters shown under the search box once the filter button is tapped.
  static const List<String> activeFilters = ['Price: Any', 'Rating: 4.5+'];

  /// The three curated findings: a dish, a stay and a tour.
  static const List<CuratedFinding> findings = [
    CuratedFinding(
      kind: DiscoveryKind.food,
      venue: 'Kaahwa Kanuzire',
      title: 'Kaahwa Kanuzire Restaurant - Grilled Tilapia',
      description:
          'Fresh whole Lake Victoria tilapia seasoned with local wild herbs, served with golden matooke fingers, charred lemons and a vegetable medley.',
      rating: 4.9,
      reviews: 142,
      tagline: "Chef's special",
      priceLabel: 'Price',
      price: 28000,
      unit: '',
      actionLabel: 'Order Dish',
      photo: GuestPhotos.food,
    ),
    CuratedFinding(
      kind: DiscoveryKind.stay,
      venue: 'Erimbi Suites',
      title: 'Traditional Deluxe Thatched Cottage',
      description:
          'Hand-crafted Ankole thatched roof, timber finishes, a king-size canopy bed and a private hillside veranda with valley views.',
      rating: 5.0,
      reviews: 98,
      tagline: 'Free breakfast',
      priceLabel: 'Rate',
      price: 350000,
      unit: '/night',
      actionLabel: 'Reserve',
      photo: GuestPhotos.hotelCottages,
    ),
    CuratedFinding(
      kind: DiscoveryKind.tour,
      venue: 'Erijukiro Museum',
      title: 'Ankole Longhorn Cultural Tour & Milk Ceremony',
      description:
          'Sacred royal cattle rituals, butter churning in traditional gourds (Ekyanzi) and centuries of oral folklore, under elder guidance.',
      rating: 4.8,
      reviews: 215,
      tagline: 'Guided 2h tour',
      priceLabel: 'Price',
      price: 50000,
      unit: '/person',
      actionLabel: 'Book Tour',
      photo: GuestPhotos.hotelCattleStatue,
    ),
  ];

  /// The experiences popular this week.
  static const List<TrendingExperience> trending = [
    TrendingExperience(
      title: '1520 AD Eclipse Monument Hike',
      subtitle: 'Biharwe Hill • Panoramic Vista',
      price: 20000,
      tone: TrendingTone.heritage,
    ),
    TrendingExperience(
      title: 'Eshabwe Making Masterclass',
      subtitle: 'Culinary Heritage • 45 mins',
      price: 35000,
      tone: TrendingTone.culinary,
    ),
    TrendingExperience(
      title: 'Kigezi Herbal Steam Bath',
      subtitle: 'Igongo Spa • Royal Therapy',
      price: 75000,
      tone: TrendingTone.wellness,
    ),
  ];
}
