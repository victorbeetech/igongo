// One item of the content the super admin manages in the public settings. The same
// shape serves the home banners, the search screen's curated findings and its
// trending experiences. The app shows only the active items, in the admin's order.

/// A banner, curated finding or trending experience from `content` in the public settings.
class HotelContentItem {
  /// Creates an item.
  const HotelContentItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.imageFileId,
    required this.screen,
  });

  /// Reads one item from its JSON. Keys the server did not send become empty text.
  factory HotelContentItem.fromJson(Map<String, dynamic> json) => HotelContentItem(
    id: '${json['id'] ?? ''}',
    title: '${json['title'] ?? ''}',
    subtitle: '${json['subtitle'] ?? ''}',
    imageFileId: '${json['imageFileId'] ?? ''}',
    screen: '${json['screen'] ?? ''}',
  );

  /// The item's stable id from the admin.
  final String id;

  /// The headline (banner title, finding name or experience name).
  final String title;

  /// The line under the headline (may be empty).
  final String subtitle;

  /// The uploaded picture's file id, or empty for no picture.
  final String imageFileId;

  /// The app screen code the item opens, or empty for none.
  final String screen;
}
