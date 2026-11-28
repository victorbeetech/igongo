// Tests for the no-reservation card: it shows one short call to action to book on WhatsApp.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/presentation/home/book_on_whatsapp_card.dart';

import '../../../support/pump_component.dart';

void main() {
  bothModes('the no-reservation card asks for a WhatsApp booking', (tester, dark) async {
    await pumpComponent(tester, const ProviderScope(child: BookOnWhatsappCard()), dark: dark);
    expect(find.text('No stay yet? Make a reservation on WhatsApp.'), findsOneWidget);
    expect(find.bySemanticsLabel('WhatsApp'), findsOneWidget);
  });
}
