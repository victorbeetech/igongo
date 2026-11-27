// The booking places a guest can have past visits at: every module that sells
// stays, tickets, tables or passes to guests. Equipment hire (Venues) and
// the food menu are not visits, so they are left out.

import '../../../shared/bookings/domain/booking_place.dart';
import '../../m64_tables_dinein/domain/place.dart' as tables;
import '../../m67_room_bookings/domain/place.dart' as rooms;
import '../../m68_museum/domain/place.dart' as museum;
import '../../m69_events_conferences/domain/place.dart' as events;
import '../../m71_pool/domain/place.dart' as pool;
import '../../m72_spa/domain/place.dart' as spa;
import '../../m73_crafts_bookshop/domain/place.dart' as shop;

/// Every place whose bookings count as a guest's visits.
const guestVisitPlaces = <BookingPlace>[
  rooms.place,
  tables.place,
  events.place,
  spa.place,
  museum.place,
  pool.place,
  shop.place,
];
