// One picture in the Cart banner slideshow: its caption and its photo.

/// A banner slide.
class CartSlide {
  /// Creates a slide.
  const CartSlide({required this.title, this.asset});

  /// The caption over the photo, such as "Rooms".
  final String title;

  /// The photo's asset path, or null while the owner has not supplied one (a placeholder shows).
  final String? asset;
}
