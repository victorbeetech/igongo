// The pay sheet every bill in the app uses (S77-01/S77-02): pick one of the
// methods the super admin switched on, type a phone for mobile money, then
// wait while the guest approves on their phone. The sheet asks the API
// again every few seconds; the API re-checks with the provider each time.
// Card payments show the checkout link to open (the app adds no browser
// package; the web portal opens it directly).

import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../format/ugx.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/chip/status_chip.dart';
import '../../ui/field/igongo_field.dart';
import '../application/payments_providers.dart';
import '../domain/pay_method.dart';
import '../domain/payment.dart';

/// Opens the pay sheet for record [recordId] of [module]; true once paid.
Future<bool> showPaySheet(
  BuildContext context, {
  required String module,
  required String recordId,
  required String label,
  required int owed,
  String? outlet,
}) async {
  final paid = await showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    builder: (_) => PaySheet(module: module, recordId: recordId, label: label, owed: owed, outlet: outlet),
  );
  return paid ?? false;
}

/// The sheet's body.
class PaySheet extends ConsumerStatefulWidget {
  /// Creates the sheet.
  const PaySheet({
    super.key,
    required this.module,
    required this.recordId,
    required this.label,
    required this.owed,
    this.outlet,
  });

  /// The selling module, such as `food-ordering`.
  final String module;

  /// The order or booking ID.
  final String recordId;

  /// What is being paid, for the heading.
  final String label;

  /// What is owed now, whole shillings.
  final int owed;

  /// The outlet, for food.
  final String? outlet;

  @override
  ConsumerState<PaySheet> createState() => _PaySheetState();
}

class _PaySheetState extends ConsumerState<PaySheet> {
  final _phone = TextEditingController();
  PayMethod? _method;
  Payment? _payment;
  bool _busy = false;
  String? _error;
  Timer? _poll;

  @override
  void dispose() {
    _poll?.cancel();
    _phone.dispose();
    super.dispose();
  }

  /// Starts the payment, then checks it every 4 seconds while it is pending.
  Future<void> _pay() async {
    final method = _method;
    if (method == null) return;
    if (method.needsPhone && _phone.text.trim().isEmpty) {
      setState(() => _error = 'Type the phone number that will pay.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      // Step 1: ask the API to start it with the provider.
      final payment = await ref
          .read(paymentsApiProvider)
          .pay(
            module: widget.module,
            recordId: widget.recordId,
            method: method.method,
            phone: method.needsPhone ? _phone.text.trim() : null,
          );
      setState(() => _payment = payment);
      // Step 2: keep asking until the provider says yes or no.
      if (payment.pending) _poll = Timer.periodic(const Duration(seconds: 4), (_) => _check());
      if (payment.status == 'succeeded' && mounted) Navigator.of(context).pop(true);
    } on Exception catch (e) {
      setState(() => _error = '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// Asks for the payment again; closes the sheet once it succeeded.
  Future<void> _check() async {
    final id = _payment?.id;
    if (id == null) return;
    try {
      final now = await ref.read(paymentsApiProvider).byId(id);
      if (!mounted) return;
      setState(() => _payment = now);
      if (!now.pending) _poll?.cancel();
      if (now.status == 'succeeded') Navigator.of(context).pop(true);
    } on Exception {
      // Offline for a moment: the next tick tries again.
    }
  }

  @override
  Widget build(BuildContext context) {
    final methods = ref.watch(payMethodsProvider((module: widget.module, outlet: widget.outlet)));
    final payment = _payment;
    return Padding(
      padding: EdgeInsets.fromLTRB(
        IgongoSpace.lg,
        IgongoSpace.lg,
        IgongoSpace.lg,
        IgongoSpace.lg + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          Text('Pay ${ugx(widget.owed)}', style: context.text.titleLarge),
          Text(widget.label, style: context.text.bodySmall),
          if (payment == null)
            ...methods.when(
              loading: () => [const LinearProgressIndicator()],
              error: (e, _) => [Text('Could not load the ways to pay: $e')],
              data: (list) => list.isEmpty
                  ? [const Text('No way to pay in the app is switched on yet. Please pay at the desk.')]
                  : [
                      Wrap(
                        spacing: IgongoSpace.sm,
                        children: [
                          for (final m in list)
                            ChoiceChip(
                              label: Text(m.name),
                              selected: _method?.method == m.method,
                              onSelected: (_) => setState(() => _method = m),
                            ),
                        ],
                      ),
                      if (_method?.needsPhone ?? false)
                        IgongoField(
                          label: 'Phone number',
                          hint: '07XX XXX XXX',
                          controller: _phone,
                          keyboardType: TextInputType.phone,
                        ),
                      if (_method?.kind == 'staff') const Text('Staff will confirm this when you pay at the desk.'),
                      IgongoButton(
                        label: _busy ? 'Starting…' : 'Pay now',
                        expand: true,
                        onPressed: _busy || _method == null ? null : _pay,
                      ),
                    ],
            )
          else ...[
            StatusChip(statusWords(payment.status)),
            if (payment.pending && payment.redirectUrl == null)
              const Text('Approve the payment on your phone. This page updates by itself.'),
            if (payment.redirectUrl case final url?) ...[
              const Text('Open this link to pay by card, then come back:'),
              SelectableText(url),
              IgongoButton(
                label: 'Copy link',
                icon: Icons.copy,
                variant: ButtonVariant.secondary,
                onPressed: () => Clipboard.setData(ClipboardData(text: url)),
              ),
            ],
            if (payment.status == 'failed') ...[
              Text(payment.message ?? 'The payment did not go through.'),
              IgongoButton(label: 'Try again', onPressed: () => setState(() => _payment = null)),
            ],
          ],
          if (_error case final error?) Text(error, style: TextStyle(color: context.palette.error)),
        ],
      ),
    );
  }
}
