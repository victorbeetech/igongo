// Finds the admin's curated findings and trending experiences that match a guest's
// search. It reads the same live items the search screen shows, so a search also
// finds the places and experiences the super admin has featured.

import '../../../shared/hotel/domain/hotel_content_item.dart';

/// The items whose title or subtitle contains every word of [query] (case-insensitive), in the order given.
/// An item listed twice (in both findings and trending) is returned once.
List<HotelContentItem> matchHotelContent(Iterable<HotelContentItem> items, String query) {
  // Step 1: split the query into lower-case words; an empty query matches nothing.
  final words = query.toLowerCase().trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
  if (words.isEmpty) return const [];
  // Step 2: keep each matching item once, keyed by its id, so a repeat is skipped.
  final seen = <String>{};
  return [
    for (final item in items)
      if (_hasEveryWord(item, words) && seen.add(item.id)) item,
  ];
}

/// True when the item's title and subtitle together contain every word.
bool _hasEveryWord(HotelContentItem item, List<String> words) {
  final text = '${item.title} ${item.subtitle}'.toLowerCase();
  return words.every(text.contains);
}
