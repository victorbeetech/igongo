// HomeTile: label and count show, and a tap opens it.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/tile/home_tile.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows the label and count and opens on tap', (tester, dark) async {
    var opened = false;
    await pumpComponent(
      tester,
      HomeTile(label: 'Orders', icon: Icons.restaurant_menu, count: '5', onTap: () => opened = true),
      dark: dark,
    );
    expect(find.text('Orders'), findsOneWidget);
    expect(find.text('5'), findsOneWidget);
    await tester.tap(find.text('Orders'));
    expect(opened, isTrue);
  });
}
