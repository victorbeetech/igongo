// The "Need a Tax E-Invoice?" banner under the list. Its button will email the
// consolidated URA receipt; for now it only says it is coming.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';

/// A quiet panel inviting the guest to email one tax invoice.
class TaxInvoiceBanner extends StatelessWidget {
  /// Creates the banner; [onEmail] runs when the button is tapped.
  const TaxInvoiceBanner({super.key, required this.onEmail});

  /// Called when "Email Folio" is tapped.
  final VoidCallback onEmail;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        children: [
          // Step 1: the mail icon in a small round badge.
          Container(
            width: IgongoTouch.minimum,
            height: IgongoTouch.minimum,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: p.primary.withValues(alpha: 0.1), shape: BoxShape.circle),
            child: Icon(Icons.mark_email_read_outlined, color: p.primaryText),
          ),
          const SizedBox(width: IgongoSpace.sm),
          // Step 2: the words, which take the space left over.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Need a Tax E-Invoice?', style: context.text.titleSmall),
                Text('Send consolidated URA receipt to email', style: context.text.bodySmall),
              ],
            ),
          ),
          // Step 3: the action, kept short so it fits beside the words.
          IgongoButton(label: 'Email Folio', variant: ButtonVariant.secondary, onPressed: onEmail),
        ],
      ),
    );
  }
}
