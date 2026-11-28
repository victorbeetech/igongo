// Tests for the Active Reservation card: a room stay shows the room buttons, an
// event booking shows the event buttons and never the digital key, and the
// room's name and status code are shown.

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking.dart';
import 'package:igongo/shared/bookings/presentation/home/active_reservation_card.dart';

import '../../../support/pump_component.dart';

/// A confirmed stay used by every test here (placeholder values).
const _stay = Booking(
  id: 'b1',
  code: 'IG-8942',
  qr: 'IG-8942',
  offeringName: 'Deluxe Thatched Chalet',
  units: 1,
  total: 0,
  paid: 0,
  status: 'confirmed',
  date: '18 Oct',
  endDate: '21 Oct',
);

/// The card for [isRoomStay], with no-op callbacks.
Widget _card({required bool isRoomStay}) => ActiveReservationCard(
  stay: _stay,
  isRoomStay: isRoomStay,
  onDigitalKey: () {},
  onRoomOrder: () {},
  onManage: () {},
  onEventDetails: () {},
  onVenue: () {},
);

void main() {
  bothModes('a room stay shows the room buttons and the status code', (tester, dark) async {
    await pumpComponent(tester, _card(isRoomStay: true), dark: dark);
    expect(find.text('ACTIVE RESERVATION'), findsOneWidget);
    expect(find.text('Deluxe Thatched Chalet'), findsOneWidget);
    expect(find.textContaining('IG-8942'), findsOneWidget);
    expect(find.text('Digital Key'), findsOneWidget);
    expect(find.text('Room Order'), findsOneWidget);
    expect(find.text('Manage'), findsOneWidget);
    expect(find.text('Event details'), findsNothing);
  });

  bothModes('an event booking never shows the digital key', (tester, dark) async {
    await pumpComponent(tester, _card(isRoomStay: false), dark: dark);
    expect(find.text('Event details'), findsOneWidget);
    expect(find.text('Venue'), findsOneWidget);
    expect(find.text('My booking'), findsOneWidget);
    expect(find.text('Digital Key'), findsNothing);
    expect(find.text('Room Order'), findsNothing);
  });
}
