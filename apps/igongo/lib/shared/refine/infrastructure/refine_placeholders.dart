// The words, choices and pictures the Filter & Refine screen shows until the
// hotel's data is wired in. Only this file changes when the real data arrives:
// the screen reads everything from here.
//
// Placeholder values, not final data: the 24 results count, the histogram shape
// and the zone details are waiting for the back end. Prices are never written
// here (repo rule): the price labels show a dash until the API sends them.

import 'package:material_ui/material_ui.dart';

import '../domain/refine_bar.dart';
import '../domain/refine_option.dart';
import '../domain/refine_price_range.dart';

/// The placeholder content of the Filter & Refine screen.
abstract final class RefinePlaceholders {
  /// The small word above the hero title (the place the filter is for).
  static const heroPlace = 'Ankole Royal Retreat';

  /// The hero title.
  static const heroTitle = 'Curate Your Igongo Stay';

  /// How many results the filter would show (a placeholder until the search is wired).
  static const resultCount = 24;

  /// The categories, several can be ticked.
  static const categories = <RefineOption>[
    RefineOption(label: 'Accommodations', icon: Icons.bed_outlined, selected: true),
    RefineOption(label: 'Dining & Drinks', icon: Icons.restaurant_outlined, selected: true),
    RefineOption(label: 'Museum & Culture', icon: Icons.museum_outlined),
    RefineOption(label: 'Spa & Wellness', icon: Icons.spa_outlined),
    RefineOption(label: 'Events & Gardens', icon: Icons.yard_outlined),
  ];

  /// The sort orders, one is picked at a time.
  static const sorts = <RefineOption>[
    RefineOption(label: 'Popularity', selected: true),
    RefineOption(label: 'Price: Low to High'),
    RefineOption(label: 'Price: High to Low'),
    RefineOption(label: 'Guest Rating (4.5+)'),
  ];

  /// The resort amenities and features, several can be ticked.
  static const amenities = <RefineOption>[
    RefineOption(label: 'Free High-Speed Wi-Fi', icon: Icons.wifi, selected: true),
    RefineOption(label: 'Swimming Pool Access', icon: Icons.pool, selected: true),
    RefineOption(label: 'Breakfast Included', icon: Icons.bakery_dining_outlined, selected: true),
    RefineOption(label: 'Room Service & Takeaway', icon: Icons.room_service_outlined),
    RefineOption(label: 'Guided Cultural Experience', icon: Icons.explore_outlined, selected: true),
  ];

  /// The zones of the grounds, one is picked at a time.
  static const zones = <RefineOption>[
    RefineOption(
      label: 'Main Resort Grounds',
      icon: Icons.villa_outlined,
      detail: 'Near swimming pool and main reception',
      selected: true,
    ),
    RefineOption(
      label: 'Cultural Village',
      icon: Icons.cottage_outlined,
      detail: 'Erijukiro museum & traditional huts',
    ),
    RefineOption(
      label: 'Kaahwa Kanuzire Lawn',
      icon: Icons.local_florist_outlined,
      detail: 'Open-air gardens and banquet terraces',
    ),
    RefineOption(
      label: 'Hill View Cottages',
      icon: Icons.landscape_outlined,
      detail: 'Elevated views facing Biharwe Eclipse Hill',
    ),
  ];

  /// The price section: the two labels (dashes until prices come from the API),
  /// the slider start (5% to 80%) and the histogram.
  static const price = RefinePriceRange(
    minLabel: 'UGX —',
    maxLabel: 'UGX —',
    low: 0.05,
    high: 0.8,
    bars: [
      RefineBar(fraction: 0.2, accent: true, opacity: 0.4),
      RefineBar(fraction: 0.45, accent: true, opacity: 0.5),
      RefineBar(fraction: 0.8, opacity: 0.7),
      RefineBar(fraction: 1),
      RefineBar(fraction: 0.9),
      RefineBar(fraction: 0.65, opacity: 0.8),
      RefineBar(fraction: 0.5, opacity: 0.6),
      RefineBar(fraction: 0.3, accent: true, opacity: 0.6),
      RefineBar(fraction: 0.15, accent: true, opacity: 0.4),
      RefineBar(fraction: 0.1, accent: true, opacity: 0.2),
    ],
  );
}
