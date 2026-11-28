// S00-18 Create an account: a new guest signs up for real with their name,
// email and a password, and agrees to the privacy notice. The account is
// always a guest account; only the super admin can make someone staff.
// Google and Apple sit at the top when on and set up. The layout follows the
// approved Create your account design. Uses the shared Auth frame.

import 'package:flutter/gestures.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/social_sign_in/sign_in_option.dart';
import '../../../../shared/social_sign_in/social_sign_in_flow.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/auth/auth_shell.dart';
import '../../../../shared/ui/auth/contact_us_link.dart';
import '../../../../shared/ui/auth/social_auth_row.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/field/password_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../../../shared/validation/sign_up_problem.dart';
import '../../application/sign_in_options_provider.dart';

/// The guest sign-up screen.
class CreateAccountScreen extends ConsumerStatefulWidget {
  /// Creates the sign-up screen for [screen].
  const CreateAccountScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<CreateAccountScreen> createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends ConsumerState<CreateAccountScreen> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  // The second password box: must match the first before the form is sent.
  final _passwordAgain = TextEditingController();
  bool _agreed = false;
  bool _busy = false;
  // Each password box has its own eye, as the design shows.
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  // Step A: the tap on the privacy notice words, created once and disposed with the screen.
  late final TapGestureRecognizer _privacyTap = TapGestureRecognizer()..onTap = () => widget.screen.open('S00-38');

  @override
  void dispose() {
    _privacyTap.dispose();
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _passwordAgain.dispose();
    super.dispose();
  }

  /// The first thing wrong with the form, or null when it can be sent.
  /// The rule lives in [signUpProblem], so this screen and its tests share it.
  String? _problem() => signUpProblem(
    name: _name.text,
    email: _email.text,
    password: _password.text,
    again: _passwordAgain.text,
    agreed: _agreed,
  );

  /// Google or Apple sign-up on this phone. A cancelled sheet does nothing; other errors show as a toast.
  Future<void> _signUpSocial(SignInOption option) async {
    // Step 1: a double tap does not open a second sheet.
    if (_busy) return;
    setState(() => _busy = true);
    try {
      // Step 2: the shared flow runs the sheet and the API; the account is created on first use.
      final started = await signInWithSocialOption(ref, option);
      if (started && mounted) widget.screen.open('home');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Creates the account and signs in, then opens the guest home.
  Future<void> _create() async {
    // Step 1: check the form here first; the server checks it again.
    final problem = _problem();
    if (problem != null) {
      showIgongoToast(context, problem);
      return;
    }
    // Step 2: sign up for real; errors show the server's message.
    setState(() => _busy = true);
    try {
      await ref.read(sessionProvider.notifier).signUpWithEmail(_name.text, _email.text, _password.text);
      if (mounted) widget.screen.open('home');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: the switched-on options, filtered to the ones this phone can finish.
    final options = ref.watch(signInOptionsProvider).valueOrNull ?? const <SignInOption>[];
    final social = availableSocialOptions(options);
    return AuthShell(
      // Step 2a: the back pill over the photo returns to the screen before this one.
      onBack: () => Navigator.of(context).maybePop(),
      // Step 2b: the card spacing from the design (24 sides, 12 top).
      cardPadding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.md, IgongoSpace.xl, IgongoSpace.lg),
      children: [
        // Step 2: the title and what this is, centred as in the design.
        Text('Create your account', textAlign: TextAlign.center, style: context.text.headlineSmall),
        Text(
          'Book rooms and events, order food and track it seamlessly.',
          textAlign: TextAlign.center,
          style: context.text.bodySmall,
        ),
        // Step 3: Google and Apple at the top, always shown; the ones not set up say so when tapped.
        SocialAuthRow(available: social, busy: _busy, onPressed: _signUpSocial),
        // Step 4: the boxes show only placeholders until focused; the label then floats to the border.
        IgongoField(label: 'Full Name', icon: Icons.person_outline, controller: _name, floatingLabel: true),
        IgongoField(
          label: 'Email Address',
          icon: Icons.mail_outline,
          controller: _email,
          keyboardType: TextInputType.emailAddress,
          floatingLabel: true,
        ),
        // Step 4a: the password box, with its own eye.
        PasswordField(
          label: 'Password',
          icon: Icons.lock_outline,
          controller: _password,
          shown: _showPassword,
          onToggle: () => setState(() => _showPassword = !_showPassword),
          floatingLabel: true,
        ),
        // Step 4b: the confirm box, required, with its own eye.
        PasswordField(
          label: 'Confirm Password',
          icon: Icons.lock_outline,
          controller: _passwordAgain,
          shown: _showConfirmPassword,
          onToggle: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
          floatingLabel: true,
        ),
        // Step 5: consent to the privacy notice. The words "privacy notice" open the About screen, which holds the policy.
        CheckboxListTile(
          value: _agreed,
          onChanged: (v) => setState(() => _agreed = v ?? false),
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
          title: Text.rich(
            TextSpan(
              style: context.text.bodySmall,
              children: [
                const TextSpan(text: 'I agree to the Igongo '),
                TextSpan(
                  text: 'privacy notice.',
                  style: TextStyle(color: context.palette.primary, decoration: TextDecoration.underline),
                  recognizer: _privacyTap,
                ),
              ],
            ),
          ),
        ),
        // Step 6: the main action.
        IgongoButton(label: _busy ? 'Creating…' : 'Create account', expand: true, onPressed: _busy ? null : _create),
        // Step 7: the footer, with the link back to sign in and the Contact Us placeholder.
        // A Wrap, so the items flow onto a second line at large text sizes instead of overflowing.
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text('Already have an account?', style: context.text.bodySmall),
            IgongoButton(label: 'Sign in', variant: ButtonVariant.text, onPressed: () => widget.screen.open('S00-05')),
          ],
        ),
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text('Need help?', style: context.text.bodySmall),
            const ContactUsLink(),
          ],
        ),
      ],
    );
  }
}
