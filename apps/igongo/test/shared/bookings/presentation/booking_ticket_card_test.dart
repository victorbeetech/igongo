// The air-ticket style receipt: the reference, the dates, the dashed tear line,
// the QR code and the barcode, in light and dark mode.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';
import 'package:igongo/shared/bookings/presentation/booking_ticket_card.dart';
import 'package:igongo/shared/ui/ticket/barcode_strip.dart';
import 'package:igongo/shared/ui/ticket/dashed_divider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../../support/pump_component.dart';

const _rooms = BookingPlace(path: '/api/rooms', module: 'room-bookings', unit: 'room');

Booking _stay() => const Booking(
  id: '7',
  code: 'IGH20250428-001',
  qr: 'IGG:IGH20250428-001',
  offeringName: 'Standard Room',
  units: 2,
  total: 360000,
  paid: 360000,
  status: 'confirmed',
  date: '2025-04-28',
  endDate: '2025-05-01',
);

void main() {
  bothModes('shows the reference, the stay dates, the QR and the barcode', (tester, dark) async {
    await pumpComponent(
      tester,
      BookingTicketCard(booking: _stay(), place: _rooms),
      dark: dark,
    );
    expect(find.text('Standard Room'), findsOneWidget);
    expect(find.text('IGH20250428-001'), findsOneWidget);
    expect(find.text('Check-in'), findsOneWidget);
    expect(find.text('Check-out'), findsOneWidget);
    expect(find.text('Mon, 28 Apr'), findsOneWidget);
    expect(find.text('2 rooms'), findsOneWidget);
    expect(find.byType(QrImageView), findsOneWidget);
    expect(find.byType(BarcodeStrip), findsOneWidget);
    expect(find.byType(DashedDivider), findsOneWidget);
  });

  bothModes('a single day shows the time, or All day', (tester, dark) async {
    const b = Booking(
      id: '8',
      code: 'TK-1',
      qr: 'IGG:TK-1',
      offeringName: 'Museum tour',
      units: 1,
      total: 0,
      paid: 0,
      status: 'confirmed',
      date: '2025-05-03',
    );
    await pumpComponent(
      tester,
      const BookingTicketCard(booking: b, place: _rooms),
      dark: dark,
    );
    expect(find.text('Time'), findsOneWidget);
    expect(find.text('All day'), findsOneWidget);
  });
}
