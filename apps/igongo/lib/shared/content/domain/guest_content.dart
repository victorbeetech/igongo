// The guest app's content as the app uses it: the banners and the greeting words.
// The API also returns stories, stays, facts and slides; those are added later.

import 'guest_banner.dart';
import 'guest_texts.dart';

/// What the guest app shows from the super admin's content.
class GuestContent {
  /// Creates the content.
  const GuestContent({this.texts = const GuestTexts(), this.banners = const []});

  /// Reads it from the content API's JSON. Missing lists are empty.
  factory GuestContent.fromJson(Map<String, dynamic> json) => GuestContent(
    texts: GuestTexts.fromJson((json['texts'] as Map<String, dynamic>?) ?? const {}),
    banners: [for (final b in (json['banners'] as List<dynamic>?) ?? const []) GuestBanner.fromJson(b as Map<String, dynamic>)],
  );

  /// The greeting and welcome words.
  final GuestTexts texts;

  /// The switched-on banners, in the order the super admin set.
  final List<GuestBanner> banners;
}
