// S00-05 Sign in: one entry point for everyone. Email and password sign in
// for real against the Igongo API (the session is kept in the phone's secure
// storage), then the other methods the super admin has switched on, and
// guest sign-up.

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
import 'sign_in_method.dart';

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
  Widget build(BuildContext context) => Scaffold(
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
                'Staff, riders and guests all sign in here.',
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
              const SizedBox(height: IgongoSpace.lg),
              Row(
                children: [
                  const Expanded(child: Divider()),
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: Text('or', style: context.text.bodySmall),
                  ),
                  const Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: IgongoSpace.sm),
              // Step 3: the other methods, each its own screen.
              for (final m in SignInMethod.all)
                Padding(
                  padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
                  child: IgongoButton(
                    label: m.label,
                    icon: m.icon,
                    variant: ButtonVariant.secondary,
                    expand: true,
                    onPressed: () => screen.open(m.screenId),
                  ),
                ),
              // Step 4: guest sign-up, and the locked account case for review.
              IgongoButton(
                label: 'New guest? Create an account',
                variant: ButtonVariant.text,
                onPressed: () => screen.open('S00-18'),
              ),
              IgongoButton(
                label: 'Prototype: show a locked account',
                variant: ButtonVariant.text,
                onPressed: () => screen.open('S00-20'),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
