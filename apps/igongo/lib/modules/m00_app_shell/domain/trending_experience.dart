// One trending experience: a walk, a class or a treatment that is popular this week.

import '../../../shared/hotel/domain/hotel_content_item.dart';
import 'trending_tone.dart';

/// An experience listed under "Trending Experiences".
class TrendingExperience {
  /// Creates an experience.
  const TrendingExperience({
    required this.title,
    required this.subtitle,
    this.price,
    this.tone,
  });

  /// Builds an experience from the super admin's content item (name and subtitle only; price and tone stay empty).
  factory TrendingExperience.fromContent(HotelContentItem item) => TrendingExperience(title: item.title, subtitle: item.subtitle);

  /// The experience's name.
  final String title;

  /// Where it is, or what kind it is, and how long it takes.
  final String subtitle;

  /// The price in whole shillings. Null until set; the row shows a dash.
  final int? price;

  /// Picks the icon and colours of its row. Null uses the neutral style.
  final TrendingTone? tone;
}
