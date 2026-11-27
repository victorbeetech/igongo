// S00-05 Sign in: one entry point for everyone. Email and password sign in
// for real against the Igongo API (the session is kept in the phone's secure
// storage). New guests create an account on S00-18. Google and Apple sit
// under the form when the server has them on (see docs/APP-WIRING.md).
// The look is the shared Auth frame, the same as the other Auth screens.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/social_sign_in/apple_native_sign_in.dart';
import '../../../../shared/social_sign_in/google_native_sign_in.dart';
import '../../../../shared/social_sign_in/social_id_token.dart';
import '../../../../shared/social_sign_in/social_sign_in_support.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/auth/auth_or_divider.dart';
import '../../../../shared/ui/auth/auth_shell.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/password_eye.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/sign_in_options_provider.dart';
import '../../domain/sign_in_option.dart';

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

  /// Google or Apple, run on this phone: the native sheet gives an ID token,
  /// the API checks it and the person lands on their home. A cancelled sheet
  /// does nothing; any other failure shows the message as a toast.
  Future<void> _signInSocial(SignInOption option) async {
    if (_busy) return; // A double tap does not open a second sheet.
    setState(() => _busy = true);
    try {
      // Step 1: the native sheet for this provider (null means the person cancelled).
      final SocialIdToken? social = option.method == 'apple'
          ? await AppleNativeSignIn().signIn()
          : await GoogleNativeSignIn().signIn();
      if (social == null) return;
      // Step 2: the API checks the token and starts the session.
      await ref.read(sessionProvider.notifier).signInWithSocial(social);
      if (mounted) screen.open('home');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Signs in, then opens the person's home. Errors show the API's message.
  Future<void> _signIn() async {
    if (_email.text.trim().isEmpty || _password.text.isEmpty) {
      showIgongoToast(context, 'Enter your email and password.');
      return;
    }
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
    // The switched-on Google and Apple options, only when the server lists them.
    final options = ref.watch(signInOptionsProvider).valueOrNull ?? const <SignInOption>[];
    // Only the ones this phone can run natively (Apple on iPhone, Google on iPhone and Android).
    final social = options.where((o) => isNativeSocialAvailable(o.method) && (o.method == 'google' || o.method == 'apple')).toList();
    return AuthShell(
      children: [
        // Step 1: the title and a short line under it.
        Text('Welcome Back', style: context.text.headlineSmall),
        Text('Sign in to continue to your account', style: context.text.bodySmall),
        // Step 2: email and password, signed in for real.
        IgongoField(
          label: 'Email address',
          hint: 'name@example.com',
          icon: Icons.mail_outline,
          controller: _email,
          keyboardType: TextInputType.emailAddress,
        ),
        IgongoField(
          label: 'Password',
          hint: 'Password',
          icon: Icons.lock_outline,
          obscure: !_showPassword,
          controller: _password,
          onSubmitted: (_) => _signIn(),
          // The shared eye button flips _showPassword.
          suffix: PasswordEyeButton(
            shown: _showPassword,
            onPressed: () => setState(() => _showPassword = !_showPassword),
          ),
        ),
        // Step 3: "Remember me" on the left, "Forgot password?" on the right.
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
        // Step 4: the Sign In button.
        IgongoButton(label: _busy ? 'Signing in…' : 'Sign In →', expand: true, onPressed: _busy ? null : _signIn),
        // Step 5: Google and Apple, only when the server has them on and set up.
        if (social.isNotEmpty) ...[
          const AuthOrDivider(),
          for (final option in social)
            IgongoButton(
              label: option.label,
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: _busy ? null : () => _signInSocial(option),
            ),
        ],
        // Step 6: guest sign-up (staff accounts come from the hotel).
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Don't have an account?", style: context.text.bodySmall),
            IgongoButton(
              label: 'Contact Us',
              variant: ButtonVariant.text,
              onPressed: () => screen.open('S00-18'),
            ),
          ],
        ),
      ],
    );
  }
}
