// The frame for every Auth screen: the shared header on top, then a white card
// that holds the screen's own content. Screens pass only their content, so the
// header, card, spacing and input boxes are the same everywhere. A screen that
// needs to go back can show a back pill over the photo instead of an app bar.

import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import 'igongo_auth_header.dart';

/// The Auth frame: [children] inside the card, below the Auth header.
class AuthShell extends StatelessWidget {
  /// Creates the frame around the screen's [children]. Pass [onBack] to show a back pill over the photo.
  const AuthShell({
    super.key,
    required this.children,
    this.appBar,
    this.onBack,
    this.cardPadding = const EdgeInsets.all(IgongoSpace.lg),
    this.gap = IgongoSpace.md,
  });

  /// The screen's content, placed inside the card in order.
  final List<Widget> children;

  /// An optional app bar. Leave null for the header look.
  final PreferredSizeWidget? appBar;

  /// Called when the back pill is tapped. Null hides the pill.
  final VoidCallback? onBack;

  /// The space inside the white card, around its content.
  final EdgeInsetsGeometry cardPadding;

  /// The space between the items inside the card.
  final double gap;

  /// The input boxes as the design shows them: a soft filled box with a thin border.
  /// Only this Auth frame changes, so the rest of the app keeps its own inputs.
  ThemeData _authTheme(BuildContext context) {
    // Step 1: take the palette tokens, so no colour is typed in here.
    final palette = context.palette;
    // Step 2: the box border, shared by the resting and focused states.
    const radius = BorderRadius.all(Radius.circular(IgongoRadius.md));
    // Step 3: the theme copy that the Auth screens' text fields read.
    return Theme.of(context).copyWith(
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: palette.surfaceAlt,
        contentPadding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.md),
        border: OutlineInputBorder(borderRadius: radius, borderSide: BorderSide(color: palette.border)),
        enabledBorder: OutlineInputBorder(borderRadius: radius, borderSide: BorderSide(color: palette.border)),
        focusedBorder: OutlineInputBorder(borderRadius: radius, borderSide: BorderSide(color: palette.primary)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 0a: the status bar height, so the back pill sits below the clock and battery.
    final topInset = MediaQuery.paddingOf(context).top;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      // Step 0b: white status-bar icons, because the photo runs behind the status bar.
      value: IgongoAuthHeader.statusBarStyle,
      child: Theme(
        // Step 0c: the Auth input style applies to everything inside this frame.
        data: _authTheme(context),
        child: Scaffold(
          appBar: appBar,
          // Step 1: no top safe area, so the header's photo runs behind the status bar.
          body: SafeArea(
            top: false,
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                // Step 2: the scrolling content, with the back pill (if any) laid over the top of it.
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        // Step 2a: the photo, the curve and the floating logo card at the top.
                        const IgongoAuthHeader(),
                        // Step 2b: the white card below the header, so the white curve flows into the form.
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
                          // A Material surface, so list tiles inside the card (such as the privacy checkbox) get their ink.
                          child: Material(
                            color: palette.surface,
                            clipBehavior: Clip.antiAlias,
                            // Only the top corners curve, as in the design, so the sheet rises from the wave.
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(top: Radius.circular(IgongoRadius.lg)),
                            ),
                            child: Padding(
                              padding: cardPadding,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                spacing: gap,
                                children: children,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    // Step 3: the back pill sits over the photo, top left and below the status bar, only when a screen asks for it.
                    if (onBack != null)
                      Positioned(
                        top: topInset + IgongoSpace.sm,
                        left: IgongoSpace.md,
                        child: _BackPill(onBack: onBack!),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A small rounded "Back" button drawn over the header photo.
class _BackPill extends StatelessWidget {
  /// Creates the pill; [onBack] runs on tap.
  const _BackPill({required this.onBack});

  /// Called when the pill is tapped.
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.surface,
      shape: const StadiumBorder(),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onBack,
        // Step 1: the tap area is at least 48 tall, so the accessibility rule for touch targets passes.
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: IgongoSpace.xs,
            children: [
              // The arrow and the word together, so screen readers say "Back".
              Icon(Icons.arrow_back, size: 18, color: palette.primaryText),
              Text('Back', style: context.text.labelLarge?.copyWith(color: palette.primaryText)),
            ],
          ),
        ),
      ),
    );
  }
}
