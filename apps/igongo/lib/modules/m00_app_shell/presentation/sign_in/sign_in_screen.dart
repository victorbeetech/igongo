// S00-05 Sign in: one entry point for everyone. Email first, then the other
// methods the super admin has switched on, and guest sign-up.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';
import 'sign_in_method.dart';

/// The sign-in screen.
class SignInScreen extends StatelessWidget {
  /// Creates the sign-in screen for [screen].
  const SignInScreen(this.screen, {super.key});

  /// The sign-in screen's context.
  final ScreenContext screen;

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
              // Step 2: email, then the password screen.
              const IgongoField(label: 'Email', hint: 'name@example.com', icon: Icons.mail_outline),
              const SizedBox(height: IgongoSpace.md),
              IgongoButton(label: 'Continue', expand: true, onPressed: () => screen.open('S00-12')),
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
