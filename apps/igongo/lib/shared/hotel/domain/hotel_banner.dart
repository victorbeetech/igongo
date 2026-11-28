// One home-screen banner the super admin manages. The carousel shows only the
// active banners, in the order the admin set.

/// A banner from the `content.banners` list of the public settings.
class HotelBanner {
  /// Creates a banner.
  const HotelBanner({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.imageFileId,
    required this.screen,
  });

  /// Reads one banner from its JSON. Keys the server did not send become empty text.
  factory HotelBanner.fromJson(Map<String, dynamic> json) => HotelBanner(
    id: '${json['id'] ?? ''}',
    title: '${json['title'] ?? ''}',
    subtitle: '${json['subtitle'] ?? ''}',
    imageFileId: '${json['imageFileId'] ?? ''}',
    screen: '${json['screen'] ?? ''}',
  );

  /// The banner's stable id from the admin.
  final String id;

  /// The headline on the banner.
  final String title;

  /// The line under the headline (may be empty).
  final String subtitle;

  /// The uploaded picture's file id, or empty for no picture.
  final String imageFileId;

  /// The app screen code the banner opens, or empty for none.
  final String screen;
}
