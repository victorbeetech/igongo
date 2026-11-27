// The "Contact Us" link in the Auth footers. Its destination is not decided
// yet (see docs/NEEDS-YOU.md), so for now it shows a "not set up yet" toast.
// Both Auth screens use this one widget, so the destination changes in one place.

import 'package:material_ui/material_ui.dart';

import '../button/igongo_button.dart';
import '../toast/igongo_toast.dart';

/// A text link that says "Contact Us", placeholder until the contact screen is decided.
class ContactUsLink extends StatelessWidget {
  /// Creates the link.
  const ContactUsLink({super.key});

  @override
  Widget build(BuildContext context) => IgongoButton(
    label: 'Contact Us',
    variant: ButtonVariant.text,
    // Step 1: placeholder action until the contact destination is chosen.
    onPressed: () => showIgongoToast(context, 'Contact details are not set up yet.'),
  );
}
