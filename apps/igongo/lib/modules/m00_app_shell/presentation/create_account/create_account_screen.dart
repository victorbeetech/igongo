// S00-18 Create an account: a new guest signs up for real with their name,
// email and a password, and agrees to the privacy notice. The account is
// always a guest account; only the super admin can make someone staff.

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
  bool _agreed = false;
  bool _busy = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  /// The first thing wrong with the form, or null when it can be sent.
  String? _problem() {
    if (_name.text.trim().isEmpty) return 'Enter your name.';
    if (!_email.text.contains('@')) return 'Enter your email.';
    if (_password.text.length < 10) return 'Use a password of at least 10 characters.';
    if (!_agreed) return 'Please agree to the privacy notice.';
    return null;
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
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(),
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: ListView(
            padding: const EdgeInsets.all(IgongoSpace.xl),
            children: [
              // Step 1: the logo and what this is.
              const IgongoLogo(shape: LogoShape.stacked, height: 96),
              const SizedBox(height: IgongoSpace.lg),
              Text('Create your account', textAlign: TextAlign.center, style: context.text.headlineSmall),
              Text(
                'Book rooms and events, order food and track it.',
                textAlign: TextAlign.center,
                style: context.text.bodySmall,
              ),
              const SizedBox(height: IgongoSpace.xl),
              // Step 2: the fields.
              IgongoField(label: 'Full name', icon: Icons.person_outline, controller: _name),
              const SizedBox(height: IgongoSpace.md),
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
                hint: 'At least 10 characters, a letter and a number',
                icon: Icons.lock_outline,
                obscure: true,
                controller: _password,
              ),
              const SizedBox(height: IgongoSpace.sm),
              // Step 3: consent to the privacy notice.
              CheckboxListTile(
                value: _agreed,
                onChanged: (v) => setState(() => _agreed = v ?? false),
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text('I agree to the Igongo privacy notice.', style: context.text.bodySmall),
              ),
              const SizedBox(height: IgongoSpace.md),
              IgongoButton(
                label: _busy ? 'Creating…' : 'Create account',
                expand: true,
                onPressed: _busy ? null : _create,
              ),
              IgongoButton(
                label: 'Already have an account? Sign in',
                variant: ButtonVariant.text,
                onPressed: () => widget.screen.open('S00-05'),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
