// S00-02 First-run welcome: three onboarding screens, swiped or moved through
// by buttons:
//   1. Welcome to Igongo: Get started (next) or Explore as a guest;
//   2. Book, Dine & Order: Back, Get started (next) or Explore as a guest;
//   3. Built for Our Entire Community: Get Started (sign-in), Explore as a
//      Guest, or Sign In.
// Skip leaves at once. However the person leaves, the welcome is not shown
// again on this phone.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import 'welcome_step_one.dart';
import 'welcome_step_three.dart';
import 'welcome_step_two.dart';

/// The first-run welcome: three onboarding screens in one page view.
class WelcomeScreen extends ConsumerStatefulWidget {
  /// Creates the welcome for [screen].
  const WelcomeScreen(this.screen, {super.key});

  /// The welcome screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  // Step 1: the controller moves the page view, from the buttons or by swiping.
  final _pages = PageController();

  @override
  void dispose() {
    // Step 2: release the controller when the welcome closes.
    _pages.dispose();
    super.dispose();
  }

  /// Moves to the screen at [page], animated unless the phone asks for less motion.
  void _goTo(int page) {
    // Step 1: ignore a page outside the three screens.
    if (page < 0 || page > 2) return;
    // Step 2: jump when reduce motion is on, otherwise slide to the page.
    if (MediaQuery.disableAnimationsOf(context)) {
      _pages.jumpToPage(page);
    } else {
      _pages.animateToPage(
        page,
        duration: Duration(milliseconds: IgongoMotion.standard.round()),
        curve: Curves.easeOutCubic,
      );
    }
  }

  /// Remembers the welcome was seen, then opens [id]. Every way out of the welcome goes through here.
  Future<void> _leave(String id) async {
    // Step 1: save the flag first, so the welcome does not come back.
    await ref.read(firstRunStoreProvider).markWelcomeSeen();
    // Step 2: open the next screen only if this one is still on the screen.
    if (mounted) widget.screen.open(id);
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: the three screens side by side. Each one gives its own buttons.
    return Scaffold(
      body: SafeArea(
        child: PageView(
          controller: _pages,
          children: [
            WelcomeStepOne(
              onNext: () => _goTo(1),
              onSkip: () => _leave('S00-05'),
              onExplore: () => _leave('home'),
            ),
            WelcomeStepTwo(
              onBack: () => _goTo(0),
              onNext: () => _goTo(2),
              onSkip: () => _leave('S00-05'),
              onExplore: () => _leave('home'),
            ),
            WelcomeStepThree(
              onNext: () => _leave('S00-05'),
              onSignIn: () => _leave('S00-05'),
              onSkip: () => _leave('S00-05'),
              onExplore: () => _leave('home'),
            ),
          ],
        ),
      ),
    );
  }
}
