// S29-01 My payslips, live: every payslip I have had, newest first.
// Tapping one opens it line by line.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/earnings_providers.dart';
import '../../domain/earnings_statement.dart';
import 'payslip_screen.dart';

/// My payslips.
class MyPayslipsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyPayslipsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<EarningsStatement>(
    screenName: screen.spec.name,
    value: ref.watch(myStatementProvider),
    onRetry: () => ref.invalidate(myStatementProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, s, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        if (s.payslips.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No payslips yet.')),
        for (final p in s.payslips)
          IgongoListRow(
            title: p.period,
            subtitle: 'Net ${ugx(p.net)} · gross ${ugx(p.gross)}',
            status: statusWords(p.status),
            onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => PayslipScreen(payslip: p))),
          ),
      ],
    ),
  );
}
