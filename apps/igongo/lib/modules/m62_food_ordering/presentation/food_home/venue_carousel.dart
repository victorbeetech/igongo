// The sideways venue slideshow: it moves to the next venue every 2.5 seconds,
// loops forever, and highlights the card in the middle of the strip. A finger
// on the strip pauses the slideshow, so a guest can read or tap a card.
// It only moves when there are two or more venues. The page width is worked
// out from the screen width, so the gap between cards stays the same on every phone.

import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import 'venue_card.dart';

/// How long each venue stays on the strip before the slideshow moves on.
const Duration kVenueSlideInterval = Duration(milliseconds: 2500);

/// How long the slide from one venue to the next takes.
const Duration kVenueSlideDuration = Duration(milliseconds: 450);

/// The space between two neighbouring cards in the strip (from the theme).
const double kVenueCardGap = IgongoSpace.sm;

/// Builds one venue card. [highlighted] is true for the card in the middle.
typedef VenueItemBuilder = Widget Function(BuildContext context, int index, bool highlighted);

/// An endless, auto-sliding row of venue cards with the middle card highlighted.
class VenueCarousel extends StatefulWidget {
  /// Creates the carousel for [itemCount] venues, built by [itemBuilder].
  const VenueCarousel({super.key, required this.itemCount, required this.itemBuilder});

  /// How many venues there are.
  final int itemCount;

  /// Builds the card for each venue.
  final VenueItemBuilder itemBuilder;

  @override
  State<VenueCarousel> createState() => _VenueCarouselState();
}

/// Holds the page controller, the slide timer and the page the middle card shows.
class _VenueCarouselState extends State<VenueCarousel> {
  /// The page the strip shows; it starts in the middle of a very large range so it can loop both ways.
  late int _page = widget.itemCount * 1000;

  /// Drives the strip. It is made once the screen width is known (see [_ensureController]).
  PageController? _controller;

  /// The share of the strip width one page takes, for the current screen width.
  double _fraction = 0;

  /// Ticks every [kVenueSlideInterval] to slide to the next venue.
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void didUpdateWidget(covariant VenueCarousel oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Step 1: if the venue count changes, restart the timer so it uses the new count.
    if (oldWidget.itemCount != widget.itemCount) _startTimer();
  }

  @override
  void dispose() {
    // Step 2: stop the timer before the widget goes, so it never fires on a dead screen.
    _timer?.cancel();
    _controller?.dispose();
    super.dispose();
  }

  /// Makes the controller for [width], so one card plus its gap fills one page.
  /// A new controller is made only when the width changes (for example on rotation),
  /// starting on the page that is showing now; the old one is disposed after this frame.
  void _ensureController(double width) {
    // Step 1: the share of the strip one card and its gap take, kept between a sensible minimum and the full width.
    final fraction = ((kVenueCardWidth + kVenueCardGap) / width).clamp(0.2, 1.0).toDouble();
    if (_controller != null && (fraction - _fraction).abs() < 0.001) return;
    // Step 2: swap in a controller for the new width, and dispose the old one once the frame is done.
    final old = _controller;
    _fraction = fraction;
    _controller = PageController(viewportFraction: fraction, initialPage: _page);
    if (old != null) WidgetsBinding.instance.addPostFrameCallback((_) => old.dispose());
  }

  /// Starts the slide timer, or stops it when there is only one venue (nothing to slide to).
  void _startTimer() {
    _timer?.cancel();
    if (widget.itemCount < 2) return;
    _timer = Timer.periodic(kVenueSlideInterval, (_) => _slideNext());
  }

  /// Slides the strip one venue on, if the strip is attached.
  void _slideNext() {
    final c = _controller;
    if (!mounted || c == null || !c.hasClients) return;
    c.nextPage(duration: kVenueSlideDuration, curve: Curves.easeInOut);
  }

  /// A finger down stops the slideshow; the finger up starts it again.
  void _pause() => _timer?.cancel();
  void _resume() => _startTimer();

  @override
  Widget build(BuildContext context) {
    final n = widget.itemCount;
    // Step 3: no venues, nothing to show.
    if (n == 0) return const SizedBox.shrink();
    return LayoutBuilder(
      builder: (context, constraints) {
        // Step 4: the page is sized to the screen, then the cards slide in it.
        _ensureController(constraints.maxWidth);
        return Listener(
          onPointerDown: (_) => _pause(),
          onPointerUp: (_) => _resume(),
          onPointerCancel: (_) => _resume(),
          child: PageView.builder(
            controller: _controller,
            onPageChanged: (page) => setState(() => _page = page),
            // The venue shown is the raw page modulo the count, so the list loops without end.
            itemBuilder: (context, page) => Center(child: widget.itemBuilder(context, page % n, page == _page)),
          ),
        );
      },
    );
  }
}
