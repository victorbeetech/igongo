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
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/auth/auth_or_divider.dart';
import '../../../../shared/ui/auth/auth_shell.dart';
import '../../../../shared/ui/button/igongo_button.dart';
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

  /// Google or Apple: the app's own sign-in for these is not set up yet
  /// (it needs the native client IDs), so the button says so honestly.
  void _socialNotReady(SignInOption option) {
    showIgongoToast(context, '${option.label} is not set up in the app yet. Use email and password for now.');
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
    final social = options.where((o) => o.method == 'google' || o.method == 'apple').toList();
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
          suffix: IconButton(
            tooltip: _showPassword ? 'Hide password' : 'Show password',
            icon: Icon(_showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 18),
            onPressed: () => setState(() => _showPassword = !_showPassword),
          ),
        ),
        // Step 3: "Remember me" on the left, "Forgot password?" on the right.
        Row(
          children: [
            Checkbox(value: _remember, onChanged: (v) => setState(() => _remember = v ?? false)),
            Text('Remember me', style: context.text.bodySmall),
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
              onPressed: () => _socialNotReady(option),
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
