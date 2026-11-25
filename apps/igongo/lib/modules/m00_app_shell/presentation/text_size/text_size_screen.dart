// S00-33 Text size setting: Compact to Extra large, with a live preview.
// The phone's own text size is applied on top of this choice.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/preferences/preferences.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/section/section_header.dart';

/// The text size setting.
class TextSizeScreen extends StatelessWidget {
  /// Creates the setting for [screen].
  const TextSizeScreen(this.screen, {super.key});

  /// The setting's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final prefs = PreferencesScope.of(context);
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: the live preview, drawn at the chosen size.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: IgongoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.xs,
              children: [
                Text('Order 3023 is ready', style: context.text.titleSmall),
                Text('1 kg fried beef, for pick-up at 16:00.', style: context.text.bodyMedium),
                Text('Today 15:52', style: context.text.bodySmall),
              ],
            ),
          ),
        ),
        // Step 2: the five sizes; picking one changes the whole app at once.
        const SectionHeader('Size'),
        RadioGroup<TextSize>(
          groupValue: prefs.textSize,
          onChanged: (v) => prefs.textSize = v!,
          child: Column(
            children: [
              for (final size in TextSize.values)
                RadioListTile<TextSize>(
                  value: size,
                  title: Text(size.label),
                  subtitle: Text('${(size.scale * 100).round()}%'),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
