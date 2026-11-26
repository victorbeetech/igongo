// A slideshow that moves to the next slide by itself and loops. Shared by the
// home's promotions banner and its dish slideshow, so both behave the same.

import 'dart:async';

import 'package:material_ui/material_ui.dart';

/// Shows [slides] one at a time, [height] tall, changing every [every].
class AutoSlides extends StatefulWidget {
  /// Creates the slideshow.
  const AutoSlides({super.key, required this.slides, required this.height, this.every = const Duration(seconds: 3)});

  /// The slides (each fills the width).
  final List<Widget> slides;

  /// The slideshow's height.
  final double height;

  /// How long each slide stays.
  final Duration every;

  @override
  State<AutoSlides> createState() => _AutoSlidesState();
}

class _AutoSlidesState extends State<AutoSlides> {
  final _page = PageController();
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Step 1: move on every [every], back to the first slide after the last.
    _timer = Timer.periodic(widget.every, (_) {
      final count = widget.slides.length;
      if (count < 2 || !_page.hasClients) return;
      final next = ((_page.page?.round() ?? 0) + 1) % count;
      _page.animateToPage(next, duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: widget.height,
    child: PageView(controller: _page, children: widget.slides),
  );
}
