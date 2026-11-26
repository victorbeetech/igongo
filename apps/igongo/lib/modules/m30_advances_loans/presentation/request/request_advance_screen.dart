// S30-02 Request advance: an advance or a loan, how much, how many months
// to repay and why, with the super admin's limits shown up front.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/advance_providers.dart';
import '../../domain/my_advances.dart';

/// The request form.
class RequestAdvanceScreen extends ConsumerStatefulWidget {
  /// Creates the form with the rules in [page].
  const RequestAdvanceScreen({super.key, required this.page});

  /// My advances and the rules.
  final MyAdvances page;

  @override
  ConsumerState<RequestAdvanceScreen> createState() => _RequestAdvanceScreenState();
}

class _RequestAdvanceScreenState extends ConsumerState<RequestAdvanceScreen> {
  late String _kind = widget.page.advance.enabled ? 'advance' : 'loan';
  final _amount = TextEditingController();
  final _months = TextEditingController(text: '1');
  final _reason = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _amount.dispose();
    _months.dispose();
    _reason.dispose();
    super.dispose();
  }

  /// Sends the request, then goes back.
  Future<void> _send() async {
    final amount = int.tryParse(_amount.text.replaceAll(',', '').trim()) ?? 0;
    if (amount <= 0 || _reason.text.trim().length < 3) {
      return showIgongoToast(context, 'Enter the amount and why you need it.');
    }
    setState(() => _busy = true);
    try {
      await ref
          .read(advancesApiProvider)
          .request(
            kind: _kind,
            amount: amount,
            instalments: int.tryParse(_months.text.trim()) ?? 1,
            reason: _reason.text.trim(),
          );
      ref.invalidate(myAdvancesProvider);
      if (!mounted) return;
      showIgongoToast(context, 'Request sent');
      Navigator.of(context).pop();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final rule = _kind == 'advance' ? widget.page.advance : widget.page.loan;
    return Scaffold(
      appBar: AppBar(title: const Text('Ask for an advance')),
      body: ScreenListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: IgongoSpace.md,
              children: [
                Wrap(
                  spacing: IgongoSpace.sm,
                  children: [
                    if (widget.page.advance.enabled)
                      ChoiceChip(
                        label: const Text('Salary advance'),
                        selected: _kind == 'advance',
                        onSelected: (_) => setState(() => _kind = 'advance'),
                      ),
                    if (widget.page.loan.enabled)
                      ChoiceChip(
                        label: const Text('Staff loan'),
                        selected: _kind == 'loan',
                        onSelected: (_) => setState(() => _kind = 'loan'),
                      ),
                  ],
                ),
                Text(
                  '${rule.maxAmount > 0 ? 'Up to ${ugx(rule.maxAmount)}' : 'No set limit'}, repaid in at most ${rule.maxInstalments} month${rule.maxInstalments == 1 ? '' : 's'}.',
                  style: context.text.bodySmall,
                ),
                IgongoField(label: 'Amount (UGX)', controller: _amount, keyboardType: TextInputType.number),
                IgongoField(label: 'Months to repay', controller: _months, keyboardType: TextInputType.number),
                IgongoField(label: 'Why', controller: _reason, lines: 3),
                IgongoButton(label: 'Send request', expand: true, onPressed: _busy ? null : _send),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
