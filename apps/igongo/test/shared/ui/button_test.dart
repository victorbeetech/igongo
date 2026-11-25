// IgongoButton: shows its label, runs its action, can be disabled, and the
// danger variant uses the error colours from the theme.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/button/igongo_button.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('runs its action on tap', (tester, dark) async {
    var taps = 0;
    await pumpComponent(
      tester,
      IgongoButton(label: 'Save', onPressed: () => taps++),
      dark: dark,
    );
    await tester.tap(find.text('Save'));
    expect(taps, 1);
  });

  bothModes('is disabled without an action', (tester, dark) async {
    await pumpComponent(tester, const IgongoButton(label: 'Save'), dark: dark);
    expect(tester.widget<FilledButton>(find.byType(FilledButton)).onPressed, isNull);
  });

  bothModes('danger uses the error and on-error tokens', (tester, dark) async {
    await pumpComponent(
      tester,
      IgongoButton(label: 'Block', variant: ButtonVariant.danger, onPressed: () {}),
      dark: dark,
    );
    final style = tester.widget<FilledButton>(find.byType(FilledButton)).style!;
    final p = tester.element(find.byType(FilledButton)).palette;
    expect(style.backgroundColor!.resolve({}), p.error);
    expect(style.foregroundColor!.resolve({}), p.onError);
  });

  bothModes('is at least the 48 tap target', (tester, dark) async {
    await pumpComponent(
      tester,
      IgongoButton(label: 'Go', onPressed: () {}),
      dark: dark,
    );
    expect(tester.getSize(find.byType(FilledButton)).height, greaterThanOrEqualTo(44));
  });
}
