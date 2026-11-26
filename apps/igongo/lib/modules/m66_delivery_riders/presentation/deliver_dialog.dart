// The "Delivered" dialog: the 4-digit code the guest gives at the door and,
// when the order is not paid, the cash taken. Returns true once done.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../application/delivery_providers.dart';
import '../domain/delivery_job.dart';

/// Asks for the code (and cash) and delivers [job].
class DeliverDialog extends ConsumerStatefulWidget {
  /// Creates the dialog.
  const DeliverDialog({super.key, required this.job});

  /// The job being delivered.
  final DeliveryJob job;

  @override
  ConsumerState<DeliverDialog> createState() => _DeliverDialogState();
}

class _DeliverDialogState extends ConsumerState<DeliverDialog> {
  final _code = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  /// Sends the code; the API says when it is wrong.
  Future<void> _deliver() async {
    final code = _code.text.trim();
    try {
      await ref
          .read(deliveryApiProvider)
          .deliver(
            widget.job.id,
            code: code.isEmpty ? null : code,
            cash: widget.job.cashToCollect > 0 ? widget.job.cashToCollect : null,
          );
      if (mounted) Navigator.of(context).pop(true);
    } on Exception catch (e) {
      setState(() => _error = '$e');
    }
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: Text('Deliver ${widget.job.orderNumber}'),
    content: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IgongoField(label: "Guest's 4-digit code", controller: _code, keyboardType: TextInputType.number),
        if (widget.job.cashToCollect > 0) Text('Collect ${ugx(widget.job.cashToCollect)} in cash.'),
        if (_error case final e?) Text(e),
      ],
    ),
    actions: [
      TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Back')),
      TextButton(onPressed: _deliver, child: const Text('Delivered')),
    ],
  );
}
