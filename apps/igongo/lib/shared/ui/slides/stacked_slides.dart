// A slideshow of cards that looks like a stack: the middle card is in front
// and clear, the two beside it sit behind it, smaller and faded. It moves by
// itself and loops. Tapping the front card runs its action; tapping a card
// behind brings it to the front.

import 'dart:async';

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// One card in the stack.
class StackedSlide {
  /// Creates a card: [child] is its picture, [label] is read aloud, [onTap] runs when it is in front.
  const StackedSlide({required this.child, required this.label, required this.onTap});

  /// What the card shows.
  final Widget child;

  /// What a screen reader says.
  final String label;

  /// Called when the front card is tapped.
  final VoidCallback onTap;
}

/// The stack, [height] tall.
class StackedSlides extends StatefulWidget {
  /// Creates the stack.
  const StackedSlides({super.key, required this.slides, required this.height, this.every = const Duration(milliseconds: 2500)});

  /// The cards.
  final List<StackedSlide> slides;

  /// The stack's height.
  final double height;

  /// How long each card stays in front.
  final Duration every;

  @override
  State<StackedSlides> createState() => _StackedSlidesState();
}

class _StackedSlidesState extends State<StackedSlides> {
  /// Each card takes about 60% of the width, so the neighbours show at the sides.
  final _page = PageController(viewportFraction: 0.6, initialPage: 1000);
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Step 1: every [every] bring the next card to the front, with a smooth glide.
    _timer = Timer.periodic(widget.every, (_) {
      if (widget.slides.length < 2 || !_page.hasClients) return;
      _go((_page.page ?? 1000).round() + 1);
    });
  }

  void _go(int page) => _page.animateToPage(page, duration: const Duration(milliseconds: 600), curve: Curves.easeInOutCubic);

  @override
  void dispose() {
    _timer?.cancel();
    _page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final n = widget.slides.length;
    return SizedBox(
      height: widget.height,
      child: PageView.builder(
        controller: _page,
        // Step 2: an endless loop: the page number modulo the card count picks the card.
        itemBuilder: (_, page) {
          final slide = widget.slides[page % n];
          return AnimatedBuilder(
            animation: _page,
            builder: (_, _) {
              // Step 3: how far this card is from the front (0 in front, 1 a full card away).
              final front = _page.hasClients ? (_page.page ?? 1000) : 1000.0;
              final away = (page - front).abs().clamp(0.0, 1.0);
              return Center(
                child: Opacity(
                  opacity: 1 - 0.55 * away,
                  child: Transform.scale(
                    scale: 1 - 0.18 * away,
                    child: Semantics(
                      button: true,
                      label: slide.label,
                      child: GestureDetector(
                        onTap: () => away < 0.5 ? slide.onTap() : _go(page),
                        child: ClipRRect(borderRadius: BorderRadius.circular(IgongoRadius.lg), child: SizedBox.expand(child: slide.child)),
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
