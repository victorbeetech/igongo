// One banner the super admin set up: shown on the guest home's promotions slot.
// Read from the content API (`/api/content`). Only switched-on banners reach the app.

/// A banner on the guest app.
class GuestBanner {
  /// Creates a banner.
  const GuestBanner({required this.id, required this.title, this.subtitle, this.imageUrl, this.linkTarget});

  /// Reads one banner from the API's JSON.
  factory GuestBanner.fromJson(Map<String, dynamic> json) => GuestBanner(
    id: '${json['id']}',
    title: '${json['title']}',
    subtitle: json['subtitle'] as String?,
    imageUrl: json['imageUrl'] as String?,
    linkTarget: json['linkTarget'] as String?,
  );

  /// The banner's id, set by the super admin screen.
  final String id;

  /// The headline people read first.
  final String title;

  /// The line under the headline, or null.
  final String? subtitle;

  /// The picture's https address, or null (the app shows the themed placeholder).
  final String? imageUrl;

  /// Where a tap goes: an in-app route or an https link, or null for no tap.
  final String? linkTarget;
}
