// S29-02 Payslip: one month's pay, line by line.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/payslip.dart';

/// One payslip.
class PayslipScreen extends StatelessWidget {
  /// Creates the screen for [payslip].
  const PayslipScreen({super.key, required this.payslip});

  /// The payslip.
  final Payslip payslip;

  /// A name and amount on one line.
  Widget _line(BuildContext context, String name, int amount, {bool bold = false}) {
    final style = bold ? context.text.titleSmall : context.text.bodyMedium;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.xs),
      child: Row(
        children: [
          Expanded(child: Text(name, style: style)),
          Text(ugx(amount), style: style),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final p = payslip;
    return Scaffold(
      appBar: AppBar(title: Text('Payslip ${p.period}')),
      body: ScreenListView(
        children: [
          _line(context, 'Basic pay', p.basic),
          for (final l in p.earnings) _line(context, l.name, l.amount),
          _line(context, 'Gross pay', p.gross, bold: true),
          for (final l in p.deductions) _line(context, l.name, -l.amount),
          _line(context, 'Total deductions', -p.totalDeductions, bold: true),
          _line(context, 'Net pay', p.net, bold: true),
        ],
      ),
    );
  }
}
