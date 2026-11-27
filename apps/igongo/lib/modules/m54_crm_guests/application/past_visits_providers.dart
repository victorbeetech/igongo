// Past visits for the Past visits screen: my bookings at every visit place,
// keeping only those that are over or cancelled, newest first. The server
// returns only the signed-in guest's own bookings, so nobody else's show.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/bookings/application/bookings_providers.dart';
import '../../../shared/bookings/data/bookings_api.dart';
import '../../../shared/bookings/domain/booking_place.dart';
import '../../../shared/format/day_key.dart';
import '../../../shared/session/session_controller.dart';
import '../domain/past_visit.dart';
import '../domain/visit_places.dart';

/// My past visits across every visit place, newest first; reloads when the session changes.
final pastVisitsProvider = FutureProvider.autoDispose<List<PastVisit>>((ref) async {
  // Step 1: reload when the person signs in or out.
  ref.watch(sessionProvider);
  final today = dayOnly(DateTime.now());
  // Step 2: ask every visit place for my bookings, all at once.
  final lists = await Future.wait([
    for (final place in guestVisitPlaces) _visitsAt(ref.watch(bookingsApiProvider(place)), place),
  ]);
  // Step 3: keep the visits that are over or cancelled, newest day first.
  return pastVisitsNewestFirst([for (final list in lists) ...list], today);
});

/// My bookings at one [place] as visits. A place that is switched off, or closed to me, has none to show.
Future<List<PastVisit>> _visitsAt(BookingsApi api, BookingPlace place) async {
  try {
    final bookings = await api.mine();
    return [for (final b in bookings) PastVisit(place: place, booking: b)];
  } on ApiException catch (e) {
    // 503: the module is off; 403: the guest may not use it. Either way there is nothing to list here.
    if (e.status == 503 || e.status == 403) return const [];
    rethrow;
  }
}
