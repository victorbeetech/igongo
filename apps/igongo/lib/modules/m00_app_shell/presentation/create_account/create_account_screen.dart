// S00-18 Create an account: a new guest signs up for real with their name,
// email and a password, and agrees to the privacy notice. The account is
// always a guest account; only the super admin can make someone staff.
// Uses the shared Auth frame, the same as the other Auth screens.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/auth/auth_shell.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/field/password_eye.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../../../shared/validation/passwords_match.dart';

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
  // One eye shows or hides both password boxes together.
  bool _showPassword = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _passwordAgain.dispose();
    super.dispose();
  }

  /// The first thing wrong with the form, or null when it can be sent.
  String? _problem() {
    if (_name.text.trim().isEmpty) return 'Enter your name.';
    if (!_email.text.contains('@')) return 'Enter your email.';
    if (_password.text.length < 8) return 'Use a password of at least 8 characters.';
    // Step 1b: both boxes must hold the same text before anything is sent.
    if (!passwordsMatch(_password.text, _passwordAgain.text)) return passwordsDifferMessage;
    if (!_agreed) return 'Please agree to the privacy notice.';
    return null;
  }

  /// Flips the show/hide flag for both password boxes.
  void _toggleShown() => setState(() => _showPassword = !_showPassword);

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
  Widget build(BuildContext context) => AuthShell(
    appBar: AppBar(),
    children: [
      // Step 1: the title and what this is.
      Text('Create your account', style: context.text.headlineSmall),
      Text('Book rooms and events, order food and track it.', style: context.text.bodySmall),
      // Step 2: the fields.
      IgongoField(label: 'Full name', hint: 'Full name', icon: Icons.person_outline, controller: _name),
      IgongoField(
        label: 'Email address',
        hint: 'name@example.com',
        icon: Icons.mail_outline,
        controller: _email,
        keyboardType: TextInputType.emailAddress,
      ),
      IgongoField(
        label: 'Password',
        hint: 'At least 8 characters, a letter and a number',
        icon: Icons.lock_outline,
        obscure: !_showPassword,
        controller: _password,
        suffix: PasswordEyeButton(shown: _showPassword, onPressed: _toggleShown),
      ),
      // Step 2b: the confirm box, required, same eye as above.
      IgongoField(
        label: 'Confirm password',
        hint: 'Type the password again',
        icon: Icons.lock_outline,
        obscure: !_showPassword,
        controller: _passwordAgain,
        suffix: PasswordEyeButton(shown: _showPassword, onPressed: _toggleShown),
      ),
      // Step 3: consent to the privacy notice.
      CheckboxListTile(
        value: _agreed,
        onChanged: (v) => setState(() => _agreed = v ?? false),
        contentPadding: EdgeInsets.zero,
        controlAffinity: ListTileControlAffinity.leading,
        title: Text('I agree to the Igongo privacy notice.', style: context.text.bodySmall),
      ),
      IgongoButton(label: _busy ? 'Creating…' : 'Create account', expand: true, onPressed: _busy ? null : _create),
      Center(
        child: IgongoButton(
          label: 'Already have an account? Sign in',
          variant: ButtonVariant.text,
          onPressed: () => widget.screen.open('S00-05'),
        ),
      ),
    ],
  );
}
