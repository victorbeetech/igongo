// The password eye: it shows the right icon and tooltip, and a tap calls back.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/field/password_eye.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('the eye offers to show a hidden password', (tester, dark) async {
    await pumpComponent(
      tester,
      PasswordEyeButton(shown: false, onPressed: () {}),
      dark: dark,
    );
    expect(find.byTooltip('Show password'), findsOneWidget);
  });

  bothModes('the eye offers to hide a shown password', (tester, dark) async {
    await pumpComponent(
      tester,
      PasswordEyeButton(shown: true, onPressed: () {}),
      dark: dark,
    );
    expect(find.byTooltip('Hide password'), findsOneWidget);
  });

  bothModes('tapping the eye calls back once', (tester, dark) async {
    var taps = 0;
    await pumpComponent(
      tester,
      PasswordEyeButton(shown: false, onPressed: () => taps++),
      dark: dark,
    );
    await tester.tap(find.byType(IconButton));
    expect(taps, 1);
  });
}
