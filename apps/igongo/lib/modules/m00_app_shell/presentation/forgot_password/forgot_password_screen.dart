// S00-17 Forgot password: emails a reset link for real. The reply is the
// same whether or not the email has an account, so nobody can use this
// screen to find out who has one. After sending, the same screen shows the
// Check Your Email view (a state of this screen, so no new screen number).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_config.dart';
import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/auth/auth_info_note.dart';
import '../../../../shared/ui/auth/auth_shell.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// The forgot-password screen, with its Check Your Email view.
class ForgotPasswordScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const ForgotPasswordScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _email = TextEditingController();
  bool _busy = false;
  bool _sent = false;

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  /// Asks the server to email a reset link, then shows the Check Your Email view.
  Future<void> _send() async {
    final email = _email.text.trim().toLowerCase();
    if (!email.contains('@')) return showIgongoToast(context, 'Enter your email.');
    setState(() => _busy = true);
    try {
      await ref.read(apiClientProvider).post('/api/auth/request-password-reset', {
        'email': email,
        'redirectTo': igongoResetPageUrl,
      });
      if (mounted) setState(() => _sent = true);
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => _sent ? _checkEmail(context) : _form(context);

  /// The form: back link, title, the email box, the reset button, and the info note.
  Widget _form(BuildContext context) => AuthShell(
    children: [
      // Step 1: the back link at the top of the card.
      IgongoButton(
        label: '← Back to sign in',
        variant: ButtonVariant.text,
        onPressed: () => widget.screen.open('S00-05'),
      ),
      Text('Forgot Password?', style: context.text.headlineSmall),
      Text(
        "Enter your email address and we'll send you a link to reset your password.",
        style: context.text.bodySmall,
      ),
      // Step 2: the email box and the reset button.
      IgongoField(
        label: 'Email address',
        hint: 'name@example.com',
        icon: Icons.mail_outline,
        controller: _email,
        keyboardType: TextInputType.emailAddress,
      ),
      IgongoButton(
        label: _busy ? 'Sending…' : 'Send Reset Link',
        icon: Icons.send_outlined,
        expand: true,
        onPressed: _busy ? null : _send,
      ),
      // Step 3: the "or" line, a back link, and the info note.
      Center(
        child: IgongoButton(
          label: 'Back to sign in',
          variant: ButtonVariant.text,
          onPressed: () => widget.screen.open('S00-05'),
        ),
      ),
      const AuthInfoNote(text: 'Check your inbox for the reset link.\nIt may take a few minutes.'),
    ],
  );

  /// The Check Your Email view: a green tick, the message, and a button back to sign in.
  Widget _checkEmail(BuildContext context) => AuthShell(
    children: [
      // Step 1: the green tick in a soft ring.
      Center(
        child: Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(color: context.palette.success.withValues(alpha: 0.15), shape: BoxShape.circle),
          child: Icon(Icons.check_circle, size: 44, color: context.palette.success, semanticLabel: 'Sent'),
        ),
      ),
      // Step 2: the message. It says the same thing whether or not the email has an account.
      Text('Check Your Email!', textAlign: TextAlign.center, style: context.text.headlineSmall),
      Text(
        "We've sent a password reset link to your email address, if an Igongo account uses it. It works once and for one hour.",
        textAlign: TextAlign.center,
        style: context.text.bodySmall,
      ),
      // Step 3: back to sign in.
      IgongoButton(
        label: 'Back to Sign In',
        expand: true,
        onPressed: () => widget.screen.open('S00-05'),
      ),
    ],
  );
}
