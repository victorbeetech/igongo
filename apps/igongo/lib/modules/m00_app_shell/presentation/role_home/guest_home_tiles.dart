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
