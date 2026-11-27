// The nine tiles on the Bookings home, in order (three across). Each opens that
// area's screen. Pictures are placeholders where the hotel has not sent one yet.

import 'package:material_ui/material_ui.dart';

import '../../ui/photo/guest_photos.dart';
import 'booking_category.dart';

/// The Bookings home tiles: rooms, food, tables, events, spa, museum, pool, shop and chat.
const bookingCategories = <BookingCategory>[
  BookingCategory(screenId: 'S67-02', label: 'Rooms', icon: Icons.bed_outlined, photo: GuestPhotos.roomStandard),
  BookingCategory(screenId: 'S62-01', label: 'Food', icon: Icons.restaurant_outlined, photo: GuestPhotos.food),
  BookingCategory(
    screenId: 'S64-04',
    label: 'Tables',
    icon: Icons.table_restaurant_outlined,
    photo: GuestPhotos.hotelKaahwaKanuzire,
  ),
  BookingCategory(screenId: 'S69-01', label: 'Events', icon: Icons.event_outlined),
  BookingCategory(screenId: 'S72-01', label: 'Spa', icon: Icons.spa_outlined),
  BookingCategory(
    screenId: 'S68-01',
    label: 'Museum and Tours',
    icon: Icons.account_balance_outlined,
    photo: GuestPhotos.hotelCulturalHut,
  ),
  BookingCategory(screenId: 'S71-01', label: 'Pool Passes', icon: Icons.pool_outlined, photo: GuestPhotos.hotelPool),
  BookingCategory(screenId: 'S73-01', label: 'Shop', icon: Icons.shopping_bag_outlined),
  BookingCategory(screenId: 'S74-03', label: 'Chat', icon: Icons.headset_mic_outlined),
];
