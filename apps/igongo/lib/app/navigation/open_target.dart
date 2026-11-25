// Opens whatever a link points at: the role home, a screen or a dialog.
// Every tap in the app that leads somewhere comes through here.

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/dialogs/show_dialog_spec.dart';
import '../catalog/catalog_index.dart';

/// Opens [id]: `home`, a screen number (S..) or a dialog number (D..).
void openTarget(BuildContext context, String id) {
  final index = CatalogIndex.instance;
  // Step 1: the role home.
  if (id == 'home') {
    context.go('/home');
    return;
  }
  // Step 2: a dialog opens over the current screen, with its module's sample fields.
  final dialog = index.dialogs[id];
  if (dialog != null) {
    final fields = index.modules[id.substring(1, 3)]!.mock.fields;
    showDialogSpec(context, dialog, fields, (next) => openTarget(context, next));
    return;
  }
  // Step 3: a screen is pushed, so Back returns here.
  final screen = index.screens[id];
  if (screen != null) context.push(index.locationOf(screen));
}
