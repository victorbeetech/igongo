// What the guest home shows of the guest role's tiles: the areas of the
// hotel only. Bookings, the cart and the account live in the bottom bar, so
// they are not repeated here, and brackets are dropped from labels so every
// tile is one short line.

/// Screens already reachable from the bottom bar or the Me tab (not tiles).
const Set<String> hiddenGuestTileIds = {
  'S54-05', // My bookings and orders: the Bookings tab
  'S78-06', // My receipts: under Me
  'S57-01', // My points: under Me
  'S74-03', // Chat with us: the floating WhatsApp button replaces it
};

/// [label] without bracketed text: "Order food (delivery...)" becomes "Order food".
String shortTileLabel(String label) => label.replaceAll(RegExp(r'\s*\([^)]*\)'), '').trim();

/// The short line under each Explore Igongo tile, by screen ID. A tile not listed here
/// shows [guestTileSubtitleFallback].
const Map<String, String> guestTileSubtitles = {
  'S67-01': 'Rooms and huts',
  'S62-01': 'Dine in or order',
  'S64-04': 'Reserve a table',
  'S68-01': 'Cultural tours',
  'S69-01': 'Events on the grounds',
  'S71-01': 'Pool passes',
  'S72-01': 'Massage and steam',
  'S73-01': 'Souvenirs and goods',
};

/// The line shown under a tile whose ID has no subtitle above.
const String guestTileSubtitleFallback = 'Hotel area';
