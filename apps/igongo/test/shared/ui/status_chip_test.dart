// StatusChip and StatusTone: the right tone for a status word, and the word
// is always shown (never colour alone).

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/chip/status_chip.dart';

import '../../support/pump_component.dart';

void main() {
  test('picks the tone from the word', () {
    expect(StatusTone.of('Paid'), StatusTone.success);
    expect(StatusTone.of('Pending'), StatusTone.warning);
    expect(StatusTone.of('Blocked'), StatusTone.error);
    expect(StatusTone.of('Scheduled'), StatusTone.info);
    expect(StatusTone.of('Archived'), StatusTone.neutral);
  });

  bothModes('shows the word', (tester, dark) async {
    await pumpComponent(tester, const StatusChip('Approved'), dark: dark);
    expect(find.text('Approved'), findsOneWidget);
  });
}
