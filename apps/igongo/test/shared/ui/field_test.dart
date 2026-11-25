// IgongoField and SearchField: label and hint show, and typing works.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/field/igongo_field.dart';
import 'package:igongo/shared/ui/search/search_field.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('a field shows its label and takes text', (tester, dark) async {
    await pumpComponent(
      tester,
      const IgongoField(label: 'Full name', hint: 'Tumusiime Ronald'),
      dark: dark,
    );
    expect(find.text('Full name'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'Esther');
    expect(find.text('Esther'), findsOneWidget);
  });

  bothModes('fields are at least the 48 tap target', (tester, dark) async {
    await pumpComponent(tester, const SearchField(hint: 'Search staff'), dark: dark);
    expect(tester.getSize(find.byType(TextField)).height, greaterThanOrEqualTo(48));
  });
}
