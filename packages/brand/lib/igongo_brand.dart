/// Paths to the Igongo brand kit files, for use with the `igongo_brand` package.
///
/// Screens never type an asset path; they use these names, so a file that
/// moves in the kit is changed in one place.
library;

/// Where each brand asset lives inside this package.
abstract final class BrandAssets {
  /// The package name used by [AssetImage] and font lookups.
  static const package = 'igongo_brand';

  /// The mark (spiral, horns and cup) for light backgrounds.
  static const markColor = 'logo/mark/igongo-mark-color.svg';

  /// The mark for dark backgrounds: cream horns and cup, red spiral.
  static const markReversed = 'logo/mark/igongo-mark-reversed.svg';

  /// The mark in white, for use on Igongo red.
  static const markWhite = 'logo/mark/igongo-mark-white.svg';

  /// The horizontal logo for light backgrounds.
  static const horizontalColor = 'logo/horizontal/igongo-horizontal-color.svg';

  /// The horizontal logo for dark backgrounds.
  static const horizontalReversed = 'logo/horizontal/igongo-horizontal-reversed.svg';

  /// The stacked logo for light backgrounds.
  static const stackedColor = 'logo/stacked/igongo-stacked-color.svg';

  /// The stacked logo for dark backgrounds.
  static const stackedReversed = 'logo/stacked/igongo-stacked-reversed.svg';

  /// The spiral alone in Igongo red, used by the loader.
  static const spiralRed = 'logo/spiral/igongo-spiral-red.svg';

  /// The default staff card (black, portrait), front and back.
  static const cardFront = 'cards/portrait-black/portrait-black-front.png';

  /// The back of the default staff card.
  static const cardBack = 'cards/portrait-black/portrait-black-back.png';
}
