// S00-01 Launch splash: the Igongo logo builds itself on the brand
// background while the app does the real start-up check, then moves on by
// itself:
//   1. first time on this phone: the welcome slides;
//   2. a saved session the server still accepts: the person's home;
//   3. otherwise: sign in.
// In design review builds (tests) it stays on the splash.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/preferences/preferences.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/ui/loader/spiral_loader.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';

/// The launch splash.
class SplashScreen extends ConsumerStatefulWidget {
  /// Creates the splash for [screen].
  const SplashScreen(this.screen, {super.key});

  /// The splash screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && !PreferencesScope.of(context).previewMode) _startUp();
    });
  }

  /// The start-up check: the logo shows at least a moment, while the saved session is checked.
  Future<void> _startUp() async {
    final results = await Future.wait<Object?>([
      ref.read(sessionProvider.future),
      ref.read(firstRunStoreProvider).welcomeSeen(),
      Future<void>.delayed(const Duration(milliseconds: 900)),
    ]);
    if (!mounted) return;
    final signedIn = results[0] != null;
    final welcomeSeen = results[1] == true;
    widget.screen.open(!welcomeSeen ? 'S00-02' : (signedIn ? 'home' : 'S00-05'));
  }

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
    // Step 2: the logo and the loader, centred.
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              logo,
              const SizedBox(height: IgongoSpace.xl),
              const SpiralLoader(size: 28),
            ],
          ),
        ),
      ),
    );
  }
}
