// One featured stay shown on the guest home's hero carousel. The words are demo
// text only; the hotel's real stays replace them later.

/// The words for one hero slide.
class GuestHeroStay {
  /// Creates a stay; every field is shown as written.
  const GuestHeroStay({
    required this.asset,
    required this.tag,
    required this.eyebrow,
    required this.title,
    required this.description,
    required this.price,
  });

  /// The demo picture for this stay, an asset path.
  final String asset;

  /// The small tag at the top left, such as "Featured stay".
  final String tag;

  /// The line above the title, such as "COMING SOON".
  final String eyebrow;

  /// The stay's name.
  final String title;

  /// One line under the title.
  final String description;

  /// The starting price line.
  final String price;

  /// The demo stays the carousel slides through, in order.
  static const demo = <GuestHeroStay>[
    GuestHeroStay(
      asset: 'assets/photos/hotel-cottages.jpg',
      tag: 'Featured stay',
      eyebrow: 'HERITAGE ROOMS',
      title: 'Heritage Suite',
      description: 'Two nights in a restored colonial room',
      price: 'From UGX — / night',
    ),
    GuestHeroStay(
      asset: 'assets/photos/hotel-gardens.jpg',
      tag: 'This weekend',
      eyebrow: 'LAKE VIEW',
      title: 'Lakeside Cottage',
      description: 'A quiet cottage with a view over the water',
      price: 'From UGX — / night',
    ),
    GuestHeroStay(
      asset: 'assets/photos/room-deluxe.jpg',
      tag: 'New',
      eyebrow: 'SPA PACKAGE',
      title: 'Rest and Renew',
      description: 'Massage, steam and a lunch on the terrace',
      price: 'From UGX — / visit',
    ),
  ];
}
