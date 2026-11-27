// The status tracker: the done steps show a tick, the rest show their number.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/presentation/booking_status_steps.dart';
import 'package:material_ui/material_ui.dart';

import '../../../support/pump_component.dart';

void main() {
  bothModes('two steps done shows two ticks and two numbers', (tester, dark) async {
    await pumpComponent(tester, const BookingStatusSteps(completed: 2), dark: dark);
    expect(find.byIcon(Icons.check), findsNWidgets(2));
    expect(find.text('3'), findsOneWidget);
    expect(find.text('4'), findsOneWidget);
    expect(find.text('Completed'), findsOneWidget);
  });
}
