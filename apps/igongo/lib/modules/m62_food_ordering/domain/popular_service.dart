// One popular service shown under an empty cart: its name, its photo and the
// screen that opens when it is tapped.

/// A popular service card.
class PopularService {
  /// Creates a card.
  const PopularService({required this.label, required this.screenId, this.asset});

  /// The name under the photo, such as "Spa".
  final String label;

  /// The screen this card opens (an S-number from the catalog).
  final String screenId;

  /// The photo's asset path, or null while the owner has not supplied one.
  final String? asset;
}
