// One trending experience: a walk, a class or a treatment that is popular this week.

import 'trending_tone.dart';

/// An experience listed under "Trending Experiences".
class TrendingExperience {
  /// Creates an experience.
  const TrendingExperience({
    required this.title,
    required this.subtitle,
    required this.price,
    required this.tone,
  });

  /// The experience's name.
  final String title;

  /// Where it is, or what kind it is, and how long it takes.
  final String subtitle;

  /// The price in whole shillings.
  final int price;

  /// Picks the icon and colours of its row.
  final TrendingTone tone;
}
