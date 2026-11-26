// S00-17 Forgot password: emails a reset link for real. The reply is the
// same whether or not the email has an account, so nobody can use this
// screen to find out who has one.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_config.dart';
import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// The forgot-password screen.
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

  /// Asks the server to email a reset link.
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
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(IgongoSpace.xl),
    children: [
      Text('Reset your password', style: context.text.headlineSmall),
      const SizedBox(height: IgongoSpace.sm),
      Text(
        _sent
            ? 'If that email has an Igongo account, a reset link is on its way. It works once and for one hour.'
            : 'Enter your email and we will send you a link to choose a new password.',
        style: context.text.bodyMedium,
      ),
      const SizedBox(height: IgongoSpace.lg),
      if (!_sent) ...[
        IgongoField(
          label: 'Email',
          icon: Icons.mail_outline,
          controller: _email,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: IgongoSpace.md),
        IgongoButton(label: _busy ? 'Sending…' : 'Send reset link', expand: true, onPressed: _busy ? null : _send),
      ],
      IgongoButton(
        label: 'Back to sign in',
        variant: ButtonVariant.text,
        onPressed: () => widget.screen.open('S00-05'),
      ),
    ],
  );
}
