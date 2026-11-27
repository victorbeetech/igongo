// The eight areas of the hotel the guest home shows in its "Explore Igongo"
// grid, in the order of the approved design. Each opens its own screen.

/// One area shown on the guest home.
class GuestArea {
  /// Creates an area with the words [label] and the screen [screenId] it opens.
  const GuestArea(this.label, this.screenId);

  /// The name on the tile, such as Rooms.
  final String label;

  /// The screen the tile opens, such as S67-01 (rooms booking).
  final String screenId;
}

/// The guest home's areas, four across and two down.
const guestAreas = <GuestArea>[
  GuestArea('Rooms', 'S67-01'),
  GuestArea('Tables', 'S64-04'),
  GuestArea('Order', 'S62-01'),
  GuestArea('Museum', 'S68-01'),
  GuestArea('Events', 'S69-01'),
  GuestArea('Pool', 'S71-01'),
  GuestArea('Spa', 'S72-01'),
  GuestArea('Shop', 'S73-01'),
];
