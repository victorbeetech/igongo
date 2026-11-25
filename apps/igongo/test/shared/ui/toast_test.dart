// The toast: shows its message with its action, one at a time.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/toast/igongo_toast.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('shows the message and the action', (tester, dark) async {
    await pumpComponent(
      tester,
      Builder(
        builder: (context) => TextButton(
          onPressed: () => showIgongoToast(context, 'Saved', action: 'Undo'),
          child: const Text('Go'),
        ),
      ),
      dark: dark,
    );
    await tester.tap(find.text('Go'));
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Saved'), findsOneWidget);
    expect(find.text('Undo'), findsOneWidget);
  });
}
