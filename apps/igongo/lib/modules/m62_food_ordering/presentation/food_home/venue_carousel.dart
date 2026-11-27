// The sideways venue slideshow: it moves to the next venue every 2.5 seconds,
// loops forever, and highlights the card in the middle of the strip. A finger
// on the strip pauses the slideshow, so a guest can read or tap a card.
// It only moves when there are two or more venues.

import 'dart:async';

import 'package:flutter/widgets.dart';

/// How long each venue stays on the strip before the slideshow moves on.
const Duration kVenueSlideInterval = Duration(milliseconds: 2500);

/// How long the slide from one venue to the next takes.
const Duration kVenueSlideDuration = Duration(milliseconds: 450);

/// The share of the strip width one card takes. Half the width leaves a small gap
/// between the middle card and its neighbours, which peek in at each side.
const double kVenueViewportFraction = 0.5;

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
  /// Drives the strip; it starts in the middle of a very large page range so it can loop both ways.
  late final PageController _controller = PageController(
    viewportFraction: kVenueViewportFraction,
    initialPage: widget.itemCount * 1000,
  );

  /// Ticks every [kVenueSlideInterval] to slide to the next venue.
  Timer? _timer;

  /// The page now in the middle (raw page number, not wrapped to the venue count).
  late int _page = _controller.initialPage;

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
    _controller.dispose();
    super.dispose();
  }

  /// Starts the slide timer, or stops it when there is only one venue (nothing to slide to).
  void _startTimer() {
    _timer?.cancel();
    if (widget.itemCount < 2) return;
    _timer = Timer.periodic(kVenueSlideInterval, (_) => _slideNext());
  }

  /// Slides the strip one venue on, if the strip is attached.
  void _slideNext() {
    if (!mounted || !_controller.hasClients) return;
    _controller.nextPage(duration: kVenueSlideDuration, curve: Curves.easeInOut);
  }

  /// A finger down stops the slideshow; the finger up starts it again.
  void _pause() => _timer?.cancel();
  void _resume() => _startTimer();

  @override
  Widget build(BuildContext context) {
    final n = widget.itemCount;
    // Step 3: a single venue, or none, needs no slideshow.
    if (n == 0) return const SizedBox.shrink();
    return Listener(
      onPointerDown: (_) => _pause(),
      onPointerUp: (_) => _resume(),
      onPointerCancel: (_) => _resume(),
      child: PageView.builder(
        controller: _controller,
        onPageChanged: (page) => setState(() => _page = page),
        // Step 4: the venue shown is the raw page modulo the count, so the list loops without end.
        itemBuilder: (context, page) => Center(child: widget.itemBuilder(context, page % n, page == _page)),
      ),
    );
  }
}
