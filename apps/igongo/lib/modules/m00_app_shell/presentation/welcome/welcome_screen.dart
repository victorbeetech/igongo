// S00-02 First-run welcome: three short slides about Igongo, then Get
// started (language, then sign in) or Explore as a guest.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';
import 'welcome_slide.dart';

/// The first-run welcome slides.
class WelcomeScreen extends StatefulWidget {
  /// Creates the welcome for [screen].
  const WelcomeScreen(this.screen, {super.key});

  /// The welcome screen's context.
  final ScreenContext screen;

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  // Which slide is showing, for the dots.
  int _page = 0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.xl),
          child: Column(
            children: [
              const IgongoLogo(shape: LogoShape.horizontal, height: 44),
              // Step 1: the slides, swiped left and right.
              Expanded(
                child: PageView(
                  onPageChanged: (i) => setState(() => _page = i),
                  children: [
                    for (final s in WelcomeSlide.all)
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        spacing: IgongoSpace.md,
                        children: [
                          Text(
                            s.title.toUpperCase(),
                            textAlign: TextAlign.center,
                            style: context.text.displaySmall?.copyWith(color: p.primaryText),
                          ),
                          Text(s.body, textAlign: TextAlign.center, style: context.text.bodyLarge),
                        ],
                      ),
                  ],
                ),
              ),
              // Step 2: the dots, red for the slide showing.
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                spacing: 6,
                children: [
                  for (var i = 0; i < WelcomeSlide.all.length; i++)
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: i == _page ? 20 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: i == _page ? p.primary : p.border,
                        borderRadius: BorderRadius.circular(99),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: IgongoSpace.xl),
              // Step 3: Get started picks the language first; Explore opens the guest home.
              IgongoButton(label: 'Get started', expand: true, onPressed: () => widget.screen.open('S00-03')),
              const SizedBox(height: IgongoSpace.sm),
              IgongoButton(
                label: 'Explore as a guest',
                variant: ButtonVariant.secondary,
                expand: true,
                onPressed: () => widget.screen.open('S00-04'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
