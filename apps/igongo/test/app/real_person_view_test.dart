// What a real person (not the super admin's design preview) sees: the guest
// home with a way to sign in, no sample records anywhere, and no Preview panel.

import 'package:flutter_test/flutter_test.dart';

import '../support/open_app.dart';

void main() {
  testWidgets('a visitor browses the guest home and is offered sign-in', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/home', preview: false);
    expect(find.text('Welcome to Igongo'), findsOneWidget);
    expect(find.text('Sign in or create an account'), findsOneWidget);
    expect(find.text('Book a room'), findsOneWidget);
    // No staff shortcuts, no role switch, no preview panel.
    expect(find.text('Shortcuts'), findsNothing);
    expect(find.byTooltip('Preview'), findsNothing);
  });

  testWidgets('a screen without live data says so instead of showing samples', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/whatsapp-concierge/chat-with-igongo', preview: false);
    expect(find.text('Chat with Igongo is not in the app yet'), findsOneWidget);
  });

  testWidgets('a visitor can sign up as a guest from the sign-in screen', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/sign-in', preview: false);
    expect(find.textContaining('Prototype'), findsNothing);
    await tester.tap(find.text('New here? Create an account'));
    await tester.pumpAndSettle();
    expect(find.text('Create your account'), findsOneWidget);
  });
}
