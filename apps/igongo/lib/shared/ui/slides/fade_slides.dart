// A slideshow that crossfades from one slide to the next by itself and loops.
// Used by the home's promotions banner (a smooth fade, not a hard slide).

import 'dart:async';

import 'package:material_ui/material_ui.dart';

/// Shows [slides] one at a time, fading between them every [every].
class FadeSlides extends StatefulWidget {
  /// Creates the slideshow.
  const FadeSlides({super.key, required this.slides, this.every = const Duration(seconds: 4)});

  /// The slides (each fills the space).
  final List<Widget> slides;

  /// How long each slide stays.
  final Duration every;

  @override
  State<FadeSlides> createState() => _FadeSlidesState();
}

class _FadeSlidesState extends State<FadeSlides> {
  Timer? _timer;
  int _index = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: every [every] move to the next slide, back to the first after the last.
    _timer = Timer.periodic(widget.every, (_) {
      if (widget.slides.length < 2 || !mounted) return;
      setState(() => _index = (_index + 1) % widget.slides.length);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.slides.isEmpty) return const SizedBox.shrink();
    // Step 2: the keyed child changes, so AnimatedSwitcher crossfades the two.
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 900),
      child: KeyedSubtree(key: ValueKey(_index % widget.slides.length), child: widget.slides[_index % widget.slides.length]),
    );
  }
}
