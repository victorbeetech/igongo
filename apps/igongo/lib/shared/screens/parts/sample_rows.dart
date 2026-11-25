// Sample records for a list, from the module's sample data.

import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../mock/sample_text.dart';
import '../../ui/list_row/igongo_list_row.dart';

/// Rows of the module's sample records, each opening [opensTo] when given.
class SampleRows extends StatelessWidget {
  /// Creates [count] rows from [mock]; tapping a row opens [opensTo].
  const SampleRows({super.key, required this.mock, this.count = 6, this.onTap});

  /// The module's sample data.
  final ModuleMock mock;

  /// How many rows to show.
  final int count;

  /// What tapping a row does, if anything.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      for (var i = 0; i < count && i < mock.items.length; i++)
        IgongoListRow(
          title: mock.items[i],
          subtitle: SampleText.subtitleFor(i),
          status: SampleText.statusFor(mock, i),
          onTap: onTap,
        ),
    ],
  );
}
