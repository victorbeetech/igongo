// One slide of the hero carousel, as the super admin entered it.

import 'home_json_readers.dart';

/// A hero slide: the tag, eyebrow, title, description, price line and picture.
class HomeHeroSlide {
  /// Creates a slide from its fields.
  const HomeHeroSlide({
    required this.tag,
    required this.eyebrow,
    required this.title,
    required this.description,
    required this.price,
    required this.imageUrl,
  });

  /// Reads a slide from the settings JSON.
  factory HomeHeroSlide.fromJson(Map<String, dynamic> json) => HomeHeroSlide(
    tag: readText(json['tag']),
    eyebrow: readText(json['eyebrow']),
    title: readText(json['title']),
    description: readText(json['description']),
    price: readText(json['price']),
    imageUrl: readText(json['imageUrl']),
  );

  /// The small tag at the top left.
  final String tag;

  /// The line above the title.
  final String eyebrow;

  /// The slide's name.
  final String title;

  /// One line under the title.
  final String description;

  /// The price line, as typed.
  final String price;

  /// The picture's web address, or "" for the placeholder.
  final String imageUrl;
}
