// Everything the apps read from the public settings before or after sign-in:
// the hotel profile and the active content (banners, curated findings, trending
// experiences). One value object, built from the JSON.

import 'hotel_content_item.dart';
import 'hotel_profile.dart';

/// The public settings the apps show.
class PublicSettings {
  /// Creates the settings.
  const PublicSettings({required this.hotel, required this.banners, required this.findings, required this.trending});

  /// Reads `/api/public/settings`. Missing blocks become empty values, so the app never crashes on a partial reply.
  factory PublicSettings.fromJson(Map<String, dynamic> json) {
    final hotelJson = (json['hotel'] as Map<String, dynamic>?) ?? const <String, dynamic>{};
    final content = (json['content'] as Map<String, dynamic>?) ?? const <String, dynamic>{};
    return PublicSettings(
      hotel: HotelProfile.fromJson(hotelJson),
      banners: _activeItems(content['banners']),
      findings: _activeItems(content['findings']),
      trending: _activeItems(content['trending']),
    );
  }

  /// The active items of one list, in the admin's order. A missing list counts as empty.
  static List<HotelContentItem> _activeItems(Object? list) => [
    for (final item in (list as List<dynamic>?) ?? const <dynamic>[])
      if (item is Map<String, dynamic> && item['active'] == true) HotelContentItem.fromJson(item),
  ];

  /// The active banners for the home carousel.
  final List<HotelContentItem> banners;

  /// The hotel's contact details and name.
  final HotelProfile hotel;

  /// The curated findings for the search screen.
  final List<HotelContentItem> findings;

  /// The trending experiences for the search screen.
  final List<HotelContentItem> trending;
}
