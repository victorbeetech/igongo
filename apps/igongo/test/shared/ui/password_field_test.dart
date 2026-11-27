// The shared password field: the box hides the text by default, the eye
// shows it, tapping again hides it, and the typed text survives both taps.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/field/password_field.dart';
import 'package:material_ui/material_ui.dart';

import '../../support/pump_component.dart';

/// A host that owns the shown flag, the same way the real screens do.
class _Host extends StatefulWidget {
  const _Host({required this.controller, this.controllerAgain});

  /// The first password box's text.
  final TextEditingController controller;

  /// The second box's text, when the test wants two boxes.
  final TextEditingController? controllerAgain;

  @override
  State<_Host> createState() => _HostState();
}

class _HostState extends State<_Host> {
  bool shown = false;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      PasswordField(
        label: 'Password',
        controller: widget.controller,
        shown: shown,
        onToggle: () => setState(() => shown = !shown),
      ),
      if (widget.controllerAgain != null)
        PasswordField(
          label: 'Confirm password',
          controller: widget.controllerAgain!,
          shown: shown,
          onToggle: () => setState(() => shown = !shown),
        ),
    ],
  );
}

/// Reads whether the first underlying text field currently hides its text.
bool _hidden(WidgetTester tester) => tester.widget<EditableText>(find.byType(EditableText).first).obscureText;

void main() {
  bothModes('a new password box hides what is typed', (tester, dark) async {
    await pumpComponent(tester, _Host(controller: TextEditingController()), dark: dark);
    expect(_hidden(tester), isTrue);
    expect(find.byTooltip('Show password'), findsOneWidget);
  });

  bothModes('tapping the eye shows the text and keeps it', (tester, dark) async {
    final controller = TextEditingController();
    await pumpComponent(tester, _Host(controller: controller), dark: dark);
    await tester.enterText(find.byType(TextField), 'Igongo2026');
    await tester.tap(find.byType(IconButton));
    await tester.pump();
    expect(_hidden(tester), isFalse);
    expect(controller.text, 'Igongo2026');
    expect(find.byTooltip('Hide password'), findsOneWidget);
  });

  bothModes('tapping the eye twice hides the text again and keeps it', (tester, dark) async {
    final controller = TextEditingController();
    await pumpComponent(tester, _Host(controller: controller), dark: dark);
    await tester.enterText(find.byType(TextField), 'Igongo2026');
    await tester.tap(find.byType(IconButton));
    await tester.pump();
    await tester.tap(find.byType(IconButton));
    await tester.pump();
    expect(_hidden(tester), isTrue);
    expect(controller.text, 'Igongo2026');
  });

  bothModes('one eye shows both boxes together', (tester, dark) async {
    await pumpComponent(
      tester,
      _Host(controller: TextEditingController(), controllerAgain: TextEditingController()),
      dark: dark,
    );
    await tester.tap(find.byType(IconButton).first);
    await tester.pump();
    final fields = tester.widgetList<EditableText>(find.byType(EditableText));
    expect(fields.every((f) => !f.obscureText), isTrue);
  });
}
