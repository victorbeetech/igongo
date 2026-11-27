// The calendar: tapping a day reports it, and past days cannot be tapped.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/presentation/calendar_month_view.dart';

import '../../../support/pump_component.dart';

void main() {
  bothModes('tapping a day reports that day', (tester, dark) async {
    DateTime? picked;
    await pumpComponent(
      tester,
      CalendarMonthView(today: DateTime(2026, 11, 1), initialMonth: DateTime(2026, 11), onPick: (d) => picked = d),
      dark: dark,
    );
    await tester.tap(find.text('15'));
    await tester.pump();
    expect(picked, DateTime(2026, 11, 15));
  });

  bothModes('a past day cannot be picked', (tester, dark) async {
    DateTime? picked;
    await pumpComponent(
      tester,
      CalendarMonthView(today: DateTime(2026, 11, 20), initialMonth: DateTime(2026, 11), onPick: (d) => picked = d),
      dark: dark,
    );
    await tester.tap(find.text('3'));
    await tester.pump();
    expect(picked, isNull);
  });

  bothModes('moves to the next month with the arrow', (tester, dark) async {
    await pumpComponent(
      tester,
      CalendarMonthView(today: DateTime(2026, 11, 1), initialMonth: DateTime(2026, 11), onPick: (_) {}),
      dark: dark,
    );
    expect(find.text('November 2026'), findsOneWidget);
    await tester.tap(find.byTooltip('Next month'));
    await tester.pump();
    expect(find.text('December 2026'), findsOneWidget);
  });
}
