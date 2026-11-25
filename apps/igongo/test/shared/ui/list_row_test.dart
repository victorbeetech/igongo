// IgongoListRow: title, subtitle and status show, and a tap runs its action.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/list_row/igongo_list_row.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows its text and opens on tap', (tester, dark) async {
    var opened = false;
    await pumpComponent(
      tester,
      IgongoListRow(title: 'Okello James', subtitle: 'Pool', status: 'Pending', onTap: () => opened = true),
      dark: dark,
    );
    expect(find.text('Okello James'), findsOneWidget);
    expect(find.text('Pool'), findsOneWidget);
    expect(find.text('Pending'), findsOneWidget);
    await tester.tap(find.text('Okello James'));
    expect(opened, isTrue);
  });
}
