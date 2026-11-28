// Everything the apps read from the public settings before or after sign-in:
// the hotel profile and the banners. One value object, built from the JSON.

import 'hotel_banner.dart';
import 'hotel_profile.dart';

/// The public settings the apps show: hotel details and the active banners.
class PublicSettings {
  /// Creates the settings.
  const PublicSettings({required this.hotel, required this.banners});

  /// Reads `/api/public/settings`. Missing blocks become empty values, so the app never crashes on a partial reply.
  factory PublicSettings.fromJson(Map<String, dynamic> json) {
    final hotelJson = (json['hotel'] as Map<String, dynamic>?) ?? const <String, dynamic>{};
    final content = (json['content'] as Map<String, dynamic>?) ?? const <String, dynamic>{};
    final list = (content['banners'] as List<dynamic>?) ?? const <dynamic>[];
    return PublicSettings(
      hotel: HotelProfile.fromJson(hotelJson),
      // Step 1: only the active banners reach the carousel, in the admin's order.
      banners: [
        for (final item in list)
          if (item is Map<String, dynamic> && item['active'] == true) HotelBanner.fromJson(item),
      ],
    );
  }

  /// The hotel's contact details and name.
  final HotelProfile hotel;

  /// The active banners for the home carousel (empty when the admin has none).
  final List<HotelBanner> banners;
}
