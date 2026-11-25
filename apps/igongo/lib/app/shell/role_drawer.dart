// The side menu: the modules the person's role can open, built from the role
// at run time, never hard-coded. The super admin sees every module.

import 'package:material_ui/material_ui.dart';

import '../../shared/preferences/preferences.dart';
import '../../shared/theme/theme.dart';
import '../../shared/ui/icons/module_icons.dart';
import '../../shared/ui/logo/igongo_logo.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';

/// The menu of modules for the current role.
class RoleDrawer extends StatelessWidget {
  /// Creates the menu.
  const RoleDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    // Step 1: the role and the modules it reaches.
    final index = CatalogIndex.instance;
    final role = index.roles[PreferencesScope.of(context).roleKey] ?? index.defaultRole;
    final everything = role.key == 'super-admin';
    final modules = index.modules.values.where((m) => m.code != '00' && (everything || role.modules.contains(m.code)));
    // Step 2: the logo, the role name and one row per module.
    return Drawer(
      child: SafeArea(
        child: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                spacing: 12,
                children: [
                  const IgongoLogo(height: 36),
                  Expanded(child: Text(role.name, style: context.text.titleSmall)),
                ],
              ),
            ),
            const Divider(),
            for (final m in modules)
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
    );
  }
}
