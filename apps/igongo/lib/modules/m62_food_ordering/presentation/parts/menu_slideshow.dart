// Today's menu: an image-only slideshow, edge to edge, that moves on every
// 2.5 seconds. Missing photos show a placeholder slide.

import 'dart:async';

import 'package:material_ui/material_ui.dart';

import '../../domain/menu_item.dart';
import 'photo_placeholder.dart';

/// How long each slide stays on screen.
const menuSlideDuration = Duration(milliseconds: 2500);

/// The image-only slideshow of today's dishes.
class MenuSlideshow extends StatefulWidget {
  /// Creates the slideshow of [items] (one slide each).
  const MenuSlideshow({super.key, required this.items});

  /// The dishes, one slide each.
  final List<MenuItem> items;

  @override
  State<MenuSlideshow> createState() => _MenuSlideshowState();
}

class _MenuSlideshowState extends State<MenuSlideshow> {
  final _pages = PageController();
  Timer? _timer;
  int _page = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: advance every 2.5 seconds, but only when there is more than one slide.
    if (widget.items.length > 1) _timer = Timer.periodic(menuSlideDuration, (_) => _next());
  }

  /// Moves to the next slide, wrapping back to the first.
  void _next() {
    if (!_pages.hasClients) return;
    final next = (_page + 1) % widget.items.length;
    unawaited(_pages.animateToPage(next, duration: const Duration(milliseconds: 400), curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    // Step 2: stop the timer and release the controller when the screen leaves.
    _timer?.cancel();
    _pages.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.items.isEmpty) return const SizedBox.shrink();
    // Step 3: full width, 16:9, image only.
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: PageView.builder(
        controller: _pages,
        itemCount: widget.items.length,
        onPageChanged: (i) => _page = i,
        itemBuilder: (_, i) => PhotoPlaceholder(url: widget.items[i].photoUrl, icon: Icons.restaurant_menu),
      ),
    );
  }
}
