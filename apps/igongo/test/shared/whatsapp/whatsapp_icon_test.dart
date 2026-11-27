// WhatsappIcon: draws the green WhatsApp SVG at the requested size. The guest's one
// WhatsApp button is the floating button in the bottom corner.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/contact/whatsapp_float_button.dart';
import 'package:igongo/shared/ui/whatsapp/whatsapp_icon.dart';

import '../../support/pump_component.dart';

void main() {
  bothModes('draws the WhatsApp icon at the given size', (tester, dark) async {
    await pumpComponent(tester, const WhatsappIcon(size: 32), dark: dark);
    final svg = tester.widget<SvgPicture>(find.byType(SvgPicture));
    expect(svg.width, 32);
    expect(svg.height, 32);
    expect(find.bySemanticsLabel('WhatsApp'), findsOneWidget);
  });

  bothModes('the WhatsApp button is one floating button with the WhatsApp icon', (tester, dark) async {
    await pumpComponent(tester, const WhatsappFloatButton(), dark: dark);
    expect(find.byType(WhatsappIcon), findsOneWidget);
    expect(find.byType(FloatingActionButton), findsOneWidget);
    expect(find.byIcon(Icons.chat_bubble_outline), findsNothing);
  });
}
