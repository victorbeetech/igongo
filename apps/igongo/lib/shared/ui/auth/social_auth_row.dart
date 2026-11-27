// The Google and Apple buttons in a row above the email form, with the "or"
// line under them. Shown only when the server has the provider on and this
// phone can run it (the screen filters the list first).

import 'package:material_ui/material_ui.dart';

import '../../social_sign_in/sign_in_option.dart';
import '../button/igongo_button.dart';
import 'auth_or_divider.dart';

/// Two side-by-side social buttons followed by the "or" divider.
class SocialAuthRow extends StatelessWidget {
  /// Creates the row for [options] (already filtered to what this phone can run).
  const SocialAuthRow({super.key, required this.options, required this.busy, required this.onPressed});

  /// The providers to show, in the order given.
  final List<SignInOption> options;

  /// True while a sign-in is running; the buttons are then disabled.
  final bool busy;

  /// Called with the tapped provider.
  final ValueChanged<SignInOption> onPressed;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      // Step 1: one button per provider, sharing the row equally.
      Row(
        spacing: 12,
        children: [
          for (final option in options)
            Expanded(
              child: IgongoButton(
                // Short names match the design; the server's longer label is not needed here.
                label: option.method == 'apple' ? 'Apple' : 'Google',
                variant: ButtonVariant.secondary,
                expand: true,
                onPressed: busy ? null : () => onPressed(option),
              ),
            ),
        ],
      ),
      // Step 2: the "or" line that separates social sign-in from the form.
      const AuthOrDivider(),
    ],
  );
}
