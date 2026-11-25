// One way to sign in, shown on the sign-in screen when the super admin has it
// switched on.

import 'package:material_ui/material_ui.dart';

/// A sign-in method button: its words, icon and the screen it opens.
class SignInMethod {
  /// Creates a method.
  const SignInMethod(this.label, this.icon, this.screenId);

  /// The words on the button.
  final String label;

  /// The button's icon.
  final IconData icon;

  /// The screen it opens.
  final String screenId;

  /// Every method, in the order they appear. Each is switched on or off by the super admin.
  static const all = [
    SignInMethod('Continue with Google', Icons.g_mobiledata, 'S00-06'),
    SignInMethod('Continue with Apple', Icons.apple, 'S00-07'),
    SignInMethod('Phone number (SMS or WhatsApp)', Icons.phone_iphone, 'S00-10'),
    SignInMethod('Tap staff card', Icons.contactless_outlined, 'S00-14'),
  ];
}
