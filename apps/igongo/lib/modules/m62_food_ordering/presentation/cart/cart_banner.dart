// The Cart's top section: a full-width photo banner that rotates through the
// hotel's services, with page dots, a wave along its bottom edge, and the cart
// count in the top-right corner.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/badge/count_badge.dart';
import '../../../../shared/ui/clip/wave_clipper.dart';
import '../../../../shared/ui/photo/guest_photo.dart';
import '../../application/cart_controller.dart';
import '../../domain/cart_content.dart';

/// The rotating banner. It changes slide every few seconds, and by hand when swiped.
class CartBanner extends ConsumerStatefulWidget {
  /// Creates the banner.
  const CartBanner({super.key});

  @override
  ConsumerState<CartBanner> createState() => _CartBannerState();
}

class _CartBannerState extends ConsumerState<CartBanner> {
  /// Seconds each slide stays before the next one comes.
  static const _every = Duration(seconds: 5);

  final _pages = PageController();
  Timer? _timer;
  int _page = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: move to the next slide on a timer, wrapping back to the first.
    _timer = Timer.periodic(_every, (_) {
      if (!_pages.hasClients) return;
      final next = (_page + 1) % cartBannerSlides.length;
      _pages.animateToPage(next, duration: const Duration(milliseconds: 500), curve: Curves.easeInOut);
    });
  }

  @override
  void dispose() {
    // Step 2: stop the timer and free the controller when the banner leaves the screen.
    _timer?.cancel();
    _pages.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final count = ref.watch(cartCountProvider);
    return ClipPath(
      clipper: const WaveClipper(),
      child: SizedBox(
        height: 220,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Step 3: the slides, one photo (or placeholder) each.
            PageView(
              controller: _pages,
              onPageChanged: (i) => setState(() => _page = i),
              children: [
                for (final s in cartBannerSlides) GuestPhoto(asset: s.asset, label: s.title),
              ],
            ),
            // Step 4: a dark fade at the bottom so the caption and dots read clearly.
            IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [palette.text.withValues(alpha: 0), palette.text.withValues(alpha: 0.55)],
                  ),
                ),
              ),
            ),
            // Step 5: the cart icon with its count, top right, as in the design.
            Positioned(
              top: IgongoSpace.md,
              right: IgongoSpace.lg,
              child: Semantics(
                label: 'Cart, $count ${count == 1 ? 'item' : 'items'}',
                child: ExcludeSemantics(
                  child: CountBadge(
                    count: count,
                    background: palette.onPrimary,
                    foreground: palette.primary,
                    child: Icon(Icons.shopping_cart_outlined, color: palette.onPrimary, size: 28),
                  ),
                ),
              ),
            ),
            // Step 6: the caption of the current slide and the page dots.
            Positioned(
              left: IgongoSpace.lg,
              right: IgongoSpace.lg,
              bottom: 26,
              child: Text(
                cartBannerSlides[_page].title,
                style: context.text.headlineSmall?.copyWith(color: palette.onPrimary, fontWeight: FontWeight.w700),
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 10,
              child: _Dots(count: cartBannerSlides.length, current: _page, colour: palette.onPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

/// The row of page dots: the current one is wider and solid.
class _Dots extends StatelessWidget {
  /// Creates the dots.
  const _Dots({required this.count, required this.current, required this.colour});

  /// How many slides.
  final int count;

  /// The slide showing now.
  final int current;

  /// The dot colour.
  final Color colour;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      for (var i = 0; i < count; i++)
        AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: 3),
          width: i == current ? 18 : 6,
          height: 6,
          decoration: BoxDecoration(
            color: i == current ? colour : colour.withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
          ),
        ),
    ],
  );
}
