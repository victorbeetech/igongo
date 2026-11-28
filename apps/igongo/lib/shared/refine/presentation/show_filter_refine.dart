// Opens the Filter & Refine screen as a tall bottom sheet over the page behind it.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import 'filter_refine_screen.dart';

/// Shows the Filter & Refine screen from the bottom of the page. Its results
/// are not returned yet: the filter is wired in a later step.
Future<void> showFilterRefine(BuildContext context) {
  // Step 1: the sheet covers most of the height and has rounded top corners.
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: context.palette.background,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
    // Step 2: the screen fills the sheet, leaving the top strip free to tap away.
    builder: (_) => SizedBox(height: MediaQuery.sizeOf(context).height * 0.92, child: const FilterRefineScreen()),
  );
}
