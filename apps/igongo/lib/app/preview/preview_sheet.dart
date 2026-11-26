// The super admin's preview panel: switch the design preview on, then pick
// the role, the screen state, the theme and the text size.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/preferences/preferences.dart';
import '../../shared/states/view_state.dart';
import '../../shared/theme/theme.dart';
import '../../shared/ui/section/section_header.dart';
import '../catalog/catalog_index.dart';

/// Opens the preview panel as a bottom sheet.
Future<void> showPreviewSheet(BuildContext context) => showModalBottomSheet<void>(
  context: context,
  isScrollControlled: true,
  builder: (_) => const FractionallySizedBox(heightFactor: 0.8, child: _PreviewPanel()),
);

class _PreviewPanel extends StatelessWidget {
  const _PreviewPanel();

  @override
  Widget build(BuildContext context) {
    final prefs = PreferencesScope.of(context);
    final roles = CatalogIndex.instance.roles.values.toList();
    // A row of choice chips, used for each setting below.
    Widget choices<T>(List<T> values, T current, String Function(T) label, void Function(T) pick) => Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
      child: Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [
          for (final v in values) ChoiceChip(label: Text(label(v)), selected: v == current, onSelected: (_) => pick(v)),
        ],
      ),
    );
    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Text('Preview', style: context.text.titleMedium),
        ),
        // The switch for the whole preview: off, the super admin sees their real app.
        SwitchListTile(
          secondary: const Icon(Icons.visibility_outlined),
          title: const Text('Design preview'),
          subtitle: const Text('Show sample screens, any role and any state'),
          value: prefs.previewMode,
          onChanged: (v) => prefs.previewMode = v,
        ),
        // Step 0: the design system showcase, every token and component on one screen.
        ListTile(
          leading: const Icon(Icons.palette_outlined),
          title: const Text('Open the design system'),
          onTap: () {
            Navigator.of(context).pop();
            GoRouter.of(context).push('/design-system');
          },
        ),
        // Step 1: the state every screen shows.
        const SectionHeader('Screen state'),
        choices(ViewState.values, prefs.state, (v) => v.label, (v) => prefs.state = v),
        // Step 2: light, dark or follow the phone.
        const SectionHeader('Theme'),
        choices(
          ThemeMode.values,
          prefs.themeMode,
          (v) => switch (v) {
            ThemeMode.light => 'Light',
            ThemeMode.dark => 'Dark',
            ThemeMode.system => 'Follow the phone',
          },
          (v) => prefs.themeMode = v,
        ),
        // Step 3: the text size.
        const SectionHeader('Text size'),
        choices(TextSize.values, prefs.textSize, (v) => v.label, (v) => prefs.textSize = v),
        // Step 4: the role, which changes the home tiles and the menu.
        const SectionHeader('Role'),
        RadioGroup<String>(
          groupValue: prefs.roleKey,
          onChanged: (v) => prefs.roleKey = v!,
          child: Column(
            children: [
              for (final r in roles) RadioListTile<String>(value: r.key, title: Text(r.name), subtitle: Text(r.level)),
            ],
          ),
        ),
      ],
    );
  }
}
