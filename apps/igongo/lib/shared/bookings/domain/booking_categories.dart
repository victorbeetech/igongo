// The four tiles on the Bookings home, in order. Each opens that module's
// booking screen, which shares the same booking flow.

import 'package:material_ui/material_ui.dart';

import 'booking_category.dart';

/// The Bookings home tiles: room, table, events and spa.
const bookingCategories = <BookingCategory>[
  BookingCategory(screenId: 'S67-02', label: 'Book a Room', icon: Icons.bed_outlined),
  BookingCategory(screenId: 'S64-04', label: 'Book a Table', icon: Icons.table_restaurant_outlined),
  BookingCategory(screenId: 'S69-01', label: 'Book Events', icon: Icons.event_outlined),
  BookingCategory(screenId: 'S72-01', label: 'Spa', icon: Icons.spa_outlined),
];
