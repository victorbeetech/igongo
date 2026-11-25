// The side menu: the modules the person's role can open, built from the role
// at run time, never hard-coded. The super admin sees every module, so a long
// menu gets a search box at the top that filters it as the person types.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/catalog/module_matches.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/theme/theme.dart';
import '../../shared/ui/icons/module_icons.dart';
import '../../shared/ui/logo/igongo_logo.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';

/// The menu of modules for the current role.
class RoleDrawer extends StatefulWidget {
  /// Creates the menu.
  const RoleDrawer({super.key});

  @override
  State<RoleDrawer> createState() => _RoleDrawerState();
}

class _RoleDrawerState extends State<RoleDrawer> {
  /// A menu longer than this gets the search box.
  static const _searchFrom = 8;

  /// What the person typed in the search box.
  String _query = '';

  @override
  Widget build(BuildContext context) {
    // Step 1: the role and the modules it reaches.
    final index = CatalogIndex.instance;
    final role = index.roles[PreferencesScope.of(context).roleKey] ?? index.defaultRole;
    final everything = role.key == 'super-admin';
    final modules = index.modules.values
        .where((m) => m.code != '00' && (everything || role.modules.contains(m.code)))
        .toList();
    // Step 2: only the modules that match the search (all of them when it is empty).
    final shown = modules.where((m) => moduleMatches(m, _query)).toList();
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            // Step 3: the logo and role name, then the search box, both fixed at the top.
            Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Row(
                spacing: IgongoSpace.md,
                children: [
                  const IgongoLogo(height: 36),
                  Expanded(child: Text(role.name, style: context.text.titleSmall)),
                ],
              ),
            ),
            if (modules.length > _searchFrom)
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.md, 0, IgongoSpace.md, IgongoSpace.sm),
                child: TextField(
                  onChanged: (v) => setState(() => _query = v),
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search ${modules.length} modules',
                    prefixIcon: const Icon(Icons.search, size: 20),
                  ),
                ),
              ),
            const Divider(),
            // Step 4: one row per matching module, scrolling under the fixed top.
            Expanded(
              child: shown.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.all(IgongoSpace.lg),
                      child: Text(
                        'No module matches "$_query".',
                        style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted),
                      ),
                    )
                  : ListView(
                      children: [
                        for (final m in shown)
                          ListTile(
                            leading: Icon(ModuleIcons.of(m.code)),
                            title: Text(m.name),
                            onTap: () {
                              // Close the menu without popping a route, then open the module.
                              Scaffold.of(context).closeDrawer();
                              openTarget(context, index.entryOf(m).id);
                            },
                          ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
