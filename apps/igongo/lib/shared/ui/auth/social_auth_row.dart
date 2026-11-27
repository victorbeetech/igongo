// The Google and Apple buttons in a row above the email form, with the "or"
// line under them. Both buttons always show, as the design asks. A button whose
// provider is not switched on, or that this phone cannot run, shows a
// "not set up yet" toast instead of failing, so the placeholder stays safe.

import 'package:material_ui/material_ui.dart';

import '../../social_sign_in/sign_in_option.dart';
import '../button/igongo_button.dart';
import '../toast/igongo_toast.dart';
import 'auth_or_divider.dart';
import 'provider_logo_slot.dart';

/// The two social buttons in a row, then the "or" divider.
class SocialAuthRow extends StatelessWidget {
  /// Creates the row. [available] holds only the providers this phone can finish right now.
  const SocialAuthRow({super.key, required this.available, required this.busy, required this.onPressed});

  /// The providers that are switched on and runnable on this phone.
  final List<SignInOption> available;

  /// True while a sign-in is running; the buttons are then disabled.
  final bool busy;

  /// Called with the tapped provider, only when it is available.
  final ValueChanged<SignInOption> onPressed;

  /// The providers the design shows, in order.
  static const _methods = ['google', 'apple'];

  /// The words on the button for a provider key.
  static String _labelFor(String method) => method == 'apple' ? 'Apple' : 'Google';

  /// Runs a tap: the provider's sign-in when it is available, otherwise a toast saying it is not set up yet.
  void _tap(BuildContext context, String method) {
    // Step 1: find this provider among the available ones.
    final matches = available.where((o) => o.method == method).toList();
    // Step 2: not available, so say so instead of starting a sign-in that cannot finish.
    if (matches.isEmpty) {
      showIgongoToast(context, '${_labelFor(method)} sign-in is not set up yet.');
      return;
    }
    // Step 3: available, so hand the option to the screen.
    onPressed(matches.first);
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      // Step 1: one button per provider, sharing the row equally.
      Row(
        spacing: 12,
        children: [
          for (final method in _methods)
            Expanded(
              child: IgongoButton(
                label: _labelFor(method),
                // The logo comes first, as in the design.
                leading: ProviderLogoSlot(method: method),
                variant: ButtonVariant.secondary,
                expand: true,
                onPressed: busy ? null : () => _tap(context, method),
              ),
            ),
        ],
      ),
      // Step 2: the "or" line that separates social sign-in from the form.
      const AuthOrDivider(),
    ],
  );
}
