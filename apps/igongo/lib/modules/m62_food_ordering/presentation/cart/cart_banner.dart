// The Cart's top section: a full-width photo banner that rotates through the
// hotel's services, with page dots, a wave along its bottom edge, and a
// wishlist heart in the top-right corner. The banner starts at the very top of
// the screen (under the status bar), so no app bar sits above it.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/clip/wave_clipper.dart';
import '../../../../shared/ui/photo/guest_photo.dart';
import '../../application/wishlist_controller.dart';
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
    // Step 1: the status bar's height, so the photo runs under it and the heart clears it.
    final topInset = MediaQuery.paddingOf(context).top;
    final saved = ref.watch(wishlistProvider);
    return ClipPath(
      clipper: const WaveClipper(),
      child: SizedBox(
        height: 220 + topInset,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Step 3: the slides, one photo (or placeholder) each.
            PageView(
              controller: _pages,
              onPageChanged: (i) => setState(() => _page = i),
              children: [for (final s in cartBannerSlides) GuestPhoto(asset: s.asset, label: s.title)],
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
            // Step 5: the wishlist heart, top right, below the status bar. Tap toggles it.
            Positioned(
              top: topInset + IgongoSpace.sm,
              right: IgongoSpace.lg,
              child: _WishlistButton(saved: saved, onTap: () => ref.read(wishlistProvider.notifier).toggle()),
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

/// The wishlist heart: a round white button with a red heart. Filled when saved.
class _WishlistButton extends StatelessWidget {
  /// Creates the button.
  const _WishlistButton({required this.saved, required this.onTap});

  /// True when the heart is on (saved).
  final bool saved;

  /// Called when the button is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the label says what a tap will do, so screen readers and tooltips match the heart.
    final label = saved ? 'Remove from wishlist' : 'Save to wishlist';
    return Semantics(
      button: true,
      toggled: saved,
      label: label,
      child: Material(
        color: palette.onPrimary,
        shape: const CircleBorder(),
        elevation: 2,
        child: IconButton(
          tooltip: label,
          onPressed: onTap,
          icon: Icon(saved ? Icons.favorite : Icons.favorite_border, color: palette.primary, size: 26),
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
