// The explore category pills on the search screen. These are the labels and
// icons of the design (navigation words, not hotel data); the pill chosen is
// kept on the screen for the highlight.

import 'package:material_ui/material_ui.dart';

/// The category pills, with the icon each one shows.
const List<({String label, IconData icon})> discoveryCategories = [
  (label: 'All', icon: Icons.travel_explore),
  (label: 'Rooms & Cottages', icon: Icons.bed),
  (label: 'Dining & Kitchen', icon: Icons.restaurant),
  (label: 'Cultural Tours', icon: Icons.temple_buddhist),
  (label: 'Wellness & Pool', icon: Icons.pool),
  (label: 'Gift Shop', icon: Icons.storefront),
];
