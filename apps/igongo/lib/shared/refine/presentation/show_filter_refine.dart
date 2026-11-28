// Opens the Filter & Refine screen as a tall bottom sheet over the search screen.

import 'package:material_ui/material_ui.dart';

import '../../../modules/m00_app_shell/domain/menu_search_results.dart';
import '../../theme/theme.dart';
import 'filter_refine_screen.dart';

/// Shows the Filter & Refine screen from the bottom of the page for the dish [results].
Future<void> showFilterRefine(BuildContext context, MenuSearchResults results) {
  // Step 1: the sheet covers most of the height and has rounded top corners.
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: context.palette.background,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
    // Step 2: the screen fills the sheet, leaving the top strip free to tap away.
    builder: (_) => SizedBox(height: MediaQuery.sizeOf(context).height * 0.92, child: FilterRefineScreen(results: results)),
  );
}
