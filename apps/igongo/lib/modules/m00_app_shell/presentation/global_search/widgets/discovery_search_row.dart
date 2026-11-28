// The search box with its mic button, and the red filter button beside it.
// The filter button shows or hides the active-filter line under the box.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// One search box and the filter button beside it.
class DiscoverySearchRow extends StatelessWidget {
  /// Creates the row. Typing calls [onChanged]; the search key calls [onSubmitted].
  const DiscoverySearchRow({
    super.key,
    required this.controller,
    required this.listening,
    required this.onFilter,
    required this.onChanged,
    required this.onSubmitted,
    required this.onVoice,
  });

  /// The text box's controller (the mic fills it with speech).
  final TextEditingController controller;

  /// True while the mic is listening; the mic then shows as active.
  final bool listening;

  /// Called when the filter button is tapped.
  final VoidCallback onFilter;

  /// Called with the text on every change.
  final ValueChanged<String> onChanged;

  /// Called with the text when the search key is pressed.
  final ValueChanged<String> onSubmitted;

  /// Called when the mic is tapped.
  final VoidCallback onVoice;

  /// The filter button's width and height (the same as the search box's height).
  static const double _buttonSize = 48;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      children: [
        // Step 1: the search box, a soft field with a search icon, the text and the mic.
        Expanded(
          child: DecoratedBox(
            decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.lg)),
            child: Row(
              children: [
                const SizedBox(width: IgongoSpace.md),
                Icon(Icons.search, color: p.textMuted),
                Expanded(
                  child: TextField(
                    controller: controller,
                    onChanged: onChanged,
                    onSubmitted: onSubmitted,
                    textInputAction: TextInputAction.search,
                    style: context.text.bodyMedium,
                    decoration: InputDecoration(
                      hintText: 'Search rooms, cultural tours, food, crafts...',
                      hintStyle: context.text.bodyMedium?.copyWith(color: p.textMuted),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.md),
                    ),
                  ),
                ),
                // Step 1a: the mic; it turns red while it is listening.
                IconButton(
                  tooltip: listening ? 'Stop listening' : 'Voice search',
                  onPressed: onVoice,
                  icon: Icon(listening ? Icons.mic : Icons.mic_none, color: listening ? p.primary : p.textMuted),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: IgongoSpace.sm),
        // Step 2: the red filter button, with a small accent dot to show filters are set.
        Semantics(
          button: true,
          label: 'Filter search',
          child: Material(
            color: p.primary,
            borderRadius: BorderRadius.circular(IgongoRadius.lg),
            child: InkWell(
              onTap: onFilter,
              borderRadius: BorderRadius.circular(IgongoRadius.lg),
              child: SizedBox(
                width: _buttonSize,
                height: _buttonSize,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Icon(Icons.tune, color: p.onPrimary),
                    Positioned(
                      top: IgongoSpace.sm,
                      right: IgongoSpace.sm,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: p.accent,
                          shape: BoxShape.circle,
                          border: Border.all(color: p.primary, width: 2),
                        ),
                        child: const SizedBox(width: 10, height: 10),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
