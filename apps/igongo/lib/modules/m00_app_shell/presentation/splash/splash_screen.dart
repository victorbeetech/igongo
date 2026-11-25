// S00-01 Launch splash: the Igongo logo builds itself on the brand
// background while the app checks the session. In the prototype, buttons
// under it choose what the start-up check finds.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/loader/spiral_loader.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';

/// The launch splash.
class SplashScreen extends StatelessWidget {
  /// Creates the splash for [screen].
  const SplashScreen(this.screen, {super.key});

  /// The splash screen's context, with the start-up paths it leads to.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final still = MediaQuery.disableAnimationsOf(context);
    // Step 1: the stacked logo fades and grows in, unless reduce motion is on.
    final logo = TweenAnimationBuilder<double>(
      tween: Tween(begin: still ? 1 : 0, end: 1),
      duration: const Duration(milliseconds: 900),
      curve: Curves.easeOutCubic,
      builder: (_, t, child) => Opacity(
        opacity: t,
        child: Transform.scale(scale: 0.9 + 0.1 * t, child: child),
      ),
      child: const IgongoLogo(shape: LogoShape.stacked, height: 180),
    );
    // Step 2: the logo, the loader and the prototype's start-up choices.
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Spacer(),
            logo,
            const SizedBox(height: IgongoSpace.xl),
            const SpiralLoader(size: 28),
            const Spacer(),
            Text('Prototype: what the start-up check finds', style: context.text.bodySmall),
            Wrap(
              alignment: WrapAlignment.center,
              children: [
                for (final id in screen.links)
                  TextButton(onPressed: () => screen.open(id), child: Text(screen.nameOf(id))),
              ],
            ),
            const SizedBox(height: IgongoSpace.lg),
          ],
        ),
      ),
    );
  }
}
