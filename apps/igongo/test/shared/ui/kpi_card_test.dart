// KpiCard: shows its label and number.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/kpi/kpi_card.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows the label and value', (tester, dark) async {
    await pumpComponent(
      tester,
      const KpiCard(label: 'On duty', value: '42'),
      dark: dark,
    );
    expect(find.text('On duty'), findsOneWidget);
    expect(find.text('42'), findsOneWidget);
  });
}
