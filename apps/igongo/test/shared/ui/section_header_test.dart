// SectionHeader: the title shows and the action runs.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/section/section_header.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows the title and runs the action', (tester, dark) async {
    var acted = false;
    await pumpComponent(
      tester,
      SectionHeader('Latest', action: 'See all', onAction: () => acted = true),
      dark: dark,
    );
    // The header writes its title in capitals.
    expect(find.textContaining(RegExp('latest', caseSensitive: false)), findsOneWidget);
    await tester.tap(find.text('See all'));
    expect(acted, isTrue);
  });
}
