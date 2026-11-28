// S00-05 Sign in: one entry point for everyone. Google and Apple sit at the
// top when the server has them on and this phone can run them. Email and
// password sign in for real against the Igongo API (the session is kept in the
// phone's secure storage). New guests sign up on S00-18. The layout follows the
// approved Sign In design: social row, form, remember me, Sign In, footer.

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
import '../../application/sign_in_options_provider.dart';

/// The sign-in screen.
class SignInScreen extends ConsumerStatefulWidget {
  /// Creates the sign-in screen for [screen].
  const SignInScreen(this.screen, {super.key});

  /// The sign-in screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _busy = false;
  bool _showPassword = false; // The eye on the password box.
  bool _remember = true; // The "Remember me" box. The session is already kept on the phone.

  ScreenContext get screen => widget.screen;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  /// Google or Apple, run on this phone. A cancelled sheet does nothing; any
  /// other failure shows the message as a toast.
  Future<void> _signInSocial(SignInOption option) async {
    // Step 1: a double tap does not open a second sheet.
    if (_busy) return;
    setState(() => _busy = true);
    try {
      // Step 2: the shared flow runs the sheet and the API; false means it was cancelled.
      final started = await signInWithSocialOption(ref, option);
      // Step 3: open the home only when the session really started.
      if (started && mounted) screen.open('home');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Signs in, then opens the person's home. Errors show the API's message.
  Future<void> _signIn() async {
    // Step 1: both boxes must be filled before the server is called.
    if (_email.text.trim().isEmpty || _password.text.isEmpty) {
      showIgongoToast(context, 'Enter your email and password.');
      return;
    }
    // Step 2: sign in for real; the server's message is shown on failure.
    setState(() => _busy = true);
    try {
      await ref.read(sessionProvider.notifier).signInWithEmail(_email.text.trim(), _password.text);
      if (mounted) screen.open('home');
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
      // Step 2: the card spacing from the design (24 sides, 12 top).
      cardPadding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.md, IgongoSpace.xl, IgongoSpace.lg),
      children: [
        // Step 3: the title and a short line under it, centred as in the design.
        Text('Welcome Back', textAlign: TextAlign.center, style: context.text.headlineSmall),
        Text('Sign in to continue your luxury experience', textAlign: TextAlign.center, style: context.text.bodySmall),
        // Step 3: Google and Apple at the top, always shown; the ones not set up say so when tapped.
        SocialAuthRow(available: social, busy: _busy, onPressed: _signInSocial),
        // Step 4: email and password, signed in for real.
        // Step 4a: the boxes show only placeholders until focused; the label then floats to the border.
        IgongoField(
          label: 'Email Address',
          icon: Icons.mail_outline,
          controller: _email,
          keyboardType: TextInputType.emailAddress,
          floatingLabel: true,
        ),
        PasswordField(
          label: 'Password',
          icon: Icons.lock_outline,
          controller: _password,
          shown: _showPassword,
          onToggle: () => setState(() => _showPassword = !_showPassword),
          onSubmitted: (_) => _signIn(),
          floatingLabel: true,
        ),
        // Step 5: "Remember me" on the left, "Forgot password?" on the right.
        Row(
          children: [
            // MergeSemantics joins the box and its words, so screen readers say "Remember me" for the box.
            MergeSemantics(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(value: _remember, onChanged: (v) => setState(() => _remember = v ?? false)),
                  Text('Remember me', style: context.text.bodySmall),
                ],
              ),
            ),
            const Spacer(),
            IgongoButton(
              label: 'Forgot password?',
              variant: ButtonVariant.text,
              onPressed: () => screen.open('S00-17'),
            ),
          ],
        ),
        // Step 6: the Sign In button.
        IgongoButton(label: _busy ? 'Signing in…' : 'Sign In →', expand: true, onPressed: _busy ? null : _signIn),
        // Step 7: the footer, with the guest sign-up link and the Contact Us placeholder.
        // A Wrap, so the items flow onto a second line at large text sizes instead of overflowing.
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text("Don't have an account?", style: context.text.bodySmall),
            IgongoButton(label: 'Sign Up', variant: ButtonVariant.text, onPressed: () => screen.open('S00-18')),
            Text('•', style: context.text.bodySmall),
            ContactUsLink(onPressed: () => screen.open('S00-46')),
          ],
        ),
      ],
    );
  }
}
