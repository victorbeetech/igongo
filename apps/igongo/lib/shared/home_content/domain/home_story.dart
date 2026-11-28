// One "Happening today" bubble, as the super admin entered it. A story that is
// switched off is dropped when the home reads its list.

import 'home_json_readers.dart';

/// A story bubble: a title, a short line under it, an icon and an optional picture.
class HomeStory {
  /// Creates a story from its fields.
  const HomeStory({required this.title, required this.subtitle, required this.icon, required this.imageUrl});

  /// Reads a story from the settings JSON.
  factory HomeStory.fromJson(Map<String, dynamic> json) => HomeStory(
    title: readText(json['title']),
    subtitle: readText(json['subtitle']),
    icon: readText(json['icon']),
    imageUrl: readText(json['imageUrl']),
  );

  /// The words under the bubble.
  final String title;

  /// The short line under the title, such as a time.
  final String subtitle;

  /// The icon key (see the home icon map), drawn over the picture.
  final String icon;

  /// The picture's web address, or "" for the placeholder.
  final String imageUrl;
}
