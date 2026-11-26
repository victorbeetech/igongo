// The filter sheet's choices for the room list: a price range and room types.
// Filtering happens on the phone, on the offerings the API already sent.

import 'offering.dart';

/// Price range and room-type choices; an empty filter keeps everything.
class OfferingFilter {
  /// Creates a filter. [maxPrice] null means no upper limit.
  const OfferingFilter({this.minPrice = 0, this.maxPrice, this.types = const {}});

  /// The lowest price shown, whole shillings.
  final int minPrice;

  /// The highest price shown, or null for no limit.
  final int? maxPrice;

  /// Room-type words to match in the name (such as `Deluxe`); empty means every type.
  final Set<String> types;

  /// True when nothing is filtered out.
  bool get isEmpty => minPrice == 0 && maxPrice == null && types.isEmpty;

  /// True when [o] is inside the price range and, if types are chosen, has one of them in its name.
  bool matches(Offering o) {
    // Step 1: the price range.
    if (o.price < minPrice) return false;
    if (maxPrice != null && o.price > maxPrice) return false;
    // Step 2: the room type, matched by word in the name, ignoring case.
    if (types.isEmpty) return true;
    final name = o.name.toLowerCase();
    return types.any((t) => name.contains(t.toLowerCase()));
  }

  /// The offerings from [all] that match, in the same order.
  List<Offering> apply(List<Offering> all) => all.where(matches).toList();
}
