// S00-05 Sign in: one entry point for everyone. Email and password sign in
// for real against the Igongo API (the session is kept in the phone's secure
// storage). New guests create an account on S00-18. Google and Apple join
// here once their app sign-in is set up (see docs/APP-WIRING.md).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';
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

  ScreenContext get screen => widget.screen;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  /// Step A: Google or Apple. The app's own sign-in for these is not set up yet
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
    // Step B: the switched-on Google and Apple options, only when the server lists them.
    final options = ref.watch(signInOptionsProvider).valueOrNull ?? const <SignInOption>[];
    final social = options.where((o) => o.method == 'google' || o.method == 'apple').toList();
    return _layout(context, social);
  }

  /// Lays out the sign-in screen; [social] is the Google and Apple options to show.
  Widget _layout(BuildContext context, List<SignInOption> social) => Scaffold(
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          // Keep the form a readable width on tablets and the web.
          constraints: const BoxConstraints(maxWidth: 420),
          child: ListView(
            padding: const EdgeInsets.all(IgongoSpace.xl),
            children: [
              // Step 1: the logo and a short welcome.
              const IgongoLogo(shape: LogoShape.stacked, height: 120),
              const SizedBox(height: IgongoSpace.lg),
              Text('Sign in', textAlign: TextAlign.center, style: context.text.headlineSmall),
              Text(
                'Guests and hotel staff sign in here with their own account.',
                textAlign: TextAlign.center,
                style: context.text.bodySmall,
              ),
              const SizedBox(height: IgongoSpace.xl),
              // Step 2: email and password, signed in for real.
              IgongoField(
                label: 'Email',
                hint: 'name@example.com',
                icon: Icons.mail_outline,
                controller: _email,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: IgongoSpace.md),
              IgongoField(
                label: 'Password',
                icon: Icons.lock_outline,
                obscure: true,
                controller: _password,
                onSubmitted: (_) => _signIn(),
              ),
              const SizedBox(height: IgongoSpace.md),
              IgongoButton(label: _busy ? 'Signing in…' : 'Sign in', expand: true, onPressed: _busy ? null : _signIn),
              IgongoButton(
                label: 'Forgot password?',
                variant: ButtonVariant.text,
                onPressed: () => screen.open('S00-17'),
              ),
              // Step 3: Google and Apple, only when the server has them on and set up.
              if (social.isNotEmpty) ...[
                const SizedBox(height: IgongoSpace.lg),
                Row(
                  children: [
                    const Expanded(child: Divider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm),
                      child: Text('or', style: context.text.bodySmall),
                    ),
                    const Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: IgongoSpace.md),
                for (final option in social) ...[
                  IgongoButton(
                    label: option.label,
                    variant: ButtonVariant.secondary,
                    expand: true,
                    onPressed: () => _socialNotReady(option),
                  ),
                  const SizedBox(height: IgongoSpace.sm),
                ],
              ],
              const SizedBox(height: IgongoSpace.lg),
              // Step 4: guest sign-up (staff accounts come from the hotel).
              IgongoButton(
                label: 'New here? Create an account',
                variant: ButtonVariant.text,
                onPressed: () => screen.open('S00-18'),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
