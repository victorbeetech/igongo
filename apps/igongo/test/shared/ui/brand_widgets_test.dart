// The brand widgets: the logo in every shape, the staff card, the scan ring,
// the map, the avatar, the chart and the card draw without errors.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/avatar/initials_avatar.dart';
import 'package:igongo/shared/ui/card/igongo_card.dart';
import 'package:igongo/shared/ui/chart/bar_chart.dart';
import 'package:igongo/shared/ui/logo/igongo_logo.dart';
import 'package:igongo/shared/ui/map/map_placeholder.dart';
import 'package:igongo/shared/ui/scan/scan_frame.dart';
import 'package:igongo/shared/ui/staff_card/staff_card_view.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('the logo draws in every shape', (tester, dark) async {
    await pumpComponent(
      tester,
      Column(children: [for (final s in LogoShape.values) IgongoLogo(shape: s)]),
      dark: dark,
    );
    expect(find.byType(IgongoLogo), findsNWidgets(LogoShape.values.length));
  });

  bothModes('the avatar shows initials', (tester, dark) async {
    await pumpComponent(tester, const InitialsAvatar(name: 'Natukunda Esther'), dark: dark);
    expect(find.text('NE'), findsOneWidget);
  });

  bothModes('the chart shows its labels', (tester, dark) async {
    await pumpComponent(
      tester,
      const BarChart(values: [0.2, 0.8], labels: ['Mon', 'Tue']),
      dark: dark,
    );
    expect(find.text('Mon'), findsOneWidget);
    expect(find.text('Tue'), findsOneWidget);
  });

  bothModes('a card runs its action', (tester, dark) async {
    var tapped = false;
    await pumpComponent(
      tester,
      IgongoCard(onTap: () => tapped = true, child: const Text('Card')),
      dark: dark,
    );
    await tester.tap(find.text('Card'));
    expect(tapped, isTrue);
  });

  bothModes('the scan ring, map and staff card draw', (tester, dark) async {
    await pumpComponent(tester, const Column(children: [ScanFrame(), MapPlaceholder(), StaffCardView()]), dark: dark);
    expect(find.text('Hold the card, wristband or QR code here'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
