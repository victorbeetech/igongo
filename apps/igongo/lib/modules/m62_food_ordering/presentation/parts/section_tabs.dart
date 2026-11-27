// The menu's section tabs ("Grill", "Drinks" ...): a scrolling row of tabs with
// a red bar under the chosen one.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A row of section tabs.
class SectionTabs extends StatelessWidget {
  /// Creates the tabs; [onPick] gets the tapped section's name.
  const SectionTabs({super.key, required this.sections, required this.selected, required this.onPick});

  /// The section names, in menu order.
  final List<String> sections;

  /// The chosen section, or null.
  final String? selected;

  /// Called with the tapped section's name.
  final void Function(String section) onPick;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 44,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      itemCount: sections.length,
      separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.lg),
      itemBuilder: (context, index) {
        final name = sections[index];
        final on = name == selected;
        final p = context.palette;
        return Semantics(
          button: true,
          selected: on,
          child: InkWell(
            onTap: () => onPick(name),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  name,
                  style: context.text.titleSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: on ? p.primaryText : p.textMuted,
                  ),
                ),
                const SizedBox(height: IgongoSpace.xs),
                // The red bar marks the chosen tab.
                if (on) Container(height: 3, width: 28, color: p.primary) else const SizedBox(height: 3, width: 28),
              ],
            ),
          ),
        );
      },
    ),
  );
}
