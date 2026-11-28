// The "Contact Us" link in the Auth footers (sign in and create account). The
// screen that opens is chosen by the page that uses the link, so this widget only
// shows the link and runs [onPressed]. Both Auth screens use this one widget.

import 'package:material_ui/material_ui.dart';

import '../button/igongo_button.dart';

/// A text link that says "Contact Us".
class ContactUsLink extends StatelessWidget {
  /// Creates the link. [onPressed] opens the Contact Us screen.
  const ContactUsLink({super.key, required this.onPressed});

  /// What happens when the link is tapped, such as opening the Contact Us screen.
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) =>
      IgongoButton(label: 'Contact Us', variant: ButtonVariant.text, onPressed: onPressed);
}
