// The hero card on the guest home: a carousel of featured stays. It moves to the next
// slide every 2 seconds, wraps back to the first, and can be swiped by hand. Dots under
// the card show which of the three slides is on screen.

import 'dart:async';

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import 'guest_hero_dots.dart';
import 'guest_hero_slide.dart';
import 'guest_hero_stay.dart';

/// The featured stays carousel. [onBook] opens the room list.
class GuestHeroCard extends StatefulWidget {
  /// Creates the carousel.
  const GuestHeroCard({super.key, required this.onBook});

  /// Called when the Book a room button is tapped.
  final VoidCallback onBook;

  @override
  State<GuestHeroCard> createState() => _GuestHeroCardState();
}

class _GuestHeroCardState extends State<GuestHeroCard> {
  /// The card's height in logical pixels.
  static const _height = 240.0;

  /// How long each slide stays on screen before the next one.
  static const _interval = Duration(seconds: 2);

  /// How long the slide change takes.
  static const _slideDuration = Duration(milliseconds: 400);

  /// Drives the PageView, so the timer and swipes move the same pages.
  final _controller = PageController();

  /// The timer that moves the carousel on.
  Timer? _timer;

  /// The index of the slide on screen.
  int _index = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: start the timer; each tick moves to the next slide and wraps at the end.
    _timer = Timer.periodic(_interval, (_) => _advance());
  }

  /// Moves to the next slide, going back to the first after the last.
  void _advance() {
    if (!_controller.hasClients) return;
    final next = (_index + 1) % GuestHeroStay.demo.length;
    _controller.animateToPage(next, duration: _slideDuration, curve: Curves.easeInOut);
  }

  /// Records the slide the person swiped to or the timer reached.
  void _onPageChanged(int i) => setState(() => _index = i);

  @override
  void dispose() {
    // Step 2: stop the timer and release the controller when the card leaves the screen.
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const stays = GuestHeroStay.demo;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(IgongoSpace.xl),
        child: SizedBox(
          height: _height,
          child: Stack(
            children: [
              // Step 3: the slides, swipeable, one full card each.
              PageView.builder(
                controller: _controller,
                onPageChanged: _onPageChanged,
                itemCount: stays.length,
                itemBuilder: (_, i) => GuestHeroSlide(stay: stays[i], onBook: widget.onBook),
              ),
              // Step 4: the dots at the very bottom, the current slide's dot wide.
              Positioned(
                left: 0,
                right: 0,
                bottom: IgongoSpace.xs,
                child: GuestHeroDots(count: stays.length, current: _index),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
