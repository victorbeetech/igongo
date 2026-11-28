// The Delete Account confirmation: the consequences, a "Type DELETE to confirm"
// field that enables "Permanently Delete", "Keep My Account", and a front-desk
// WhatsApp row. It pops with true only when the person confirms.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../contact/open_whatsapp_chat.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../frame/account_dialog_frame.dart';
import '../frame/dialog_icon_badge.dart';
import 'delete_consequence_row.dart';

/// Asks the person to type DELETE, then pops with true to delete, or false to keep the account.
class DeleteAccountDialog extends ConsumerStatefulWidget {
  /// Creates the dialog.
  const DeleteAccountDialog({super.key});

  @override
  ConsumerState<DeleteAccountDialog> createState() => _DeleteAccountDialogState();
}

class _DeleteAccountDialogState extends ConsumerState<DeleteAccountDialog> {
  /// The word the person must type. Case does not matter.
  static const _phrase = 'DELETE';

  /// The text field's contents.
  final _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Step 1: rebuild on each keystroke, so the button and tick follow the text.
    _controller.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// True when the typed word matches [_phrase].
  bool get _confirmed => _controller.text.trim().toUpperCase() == _phrase;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final t = context.text;
    return AccountDialogFrame(
      onClose: () => Navigator.pop(context, false),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the warning icon, the title and the permanent-action line.
          Center(
            child: DialogIconBadge(
              icon: Icons.shield_outlined,
              iconColour: p.error,
              background: p.error.withValues(alpha: 0.12),
              ring: p.error.withValues(alpha: 0.2),
            ),
          ),
          Text('Delete Account?', textAlign: TextAlign.center, style: t.headlineSmall?.copyWith(color: p.primary)),
          Text(
            'This action is permanent and irreversible. Your guest credentials and stay records will be completely erased:',
            textAlign: TextAlign.center,
            style: t.bodyMedium?.copyWith(color: p.textMuted),
          ),
          // Step 2: what is lost. The points and money values are placeholders until the API sends them.
          Container(
            padding: const EdgeInsets.all(IgongoSpace.md),
            decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
            child: const Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.sm,
              children: [
                // PLACEHOLDER: the points balance and its money value come from the API later.
                DeleteConsequenceRow(
                  icon: Icons.trending_down,
                  text: 'Forfeiture of — Ankole Heritage Loyalty Points (— value).',
                ),
                DeleteConsequenceRow(
                  icon: Icons.history_edu,
                  text: 'Permanent removal of past receipts, tour certificates and folio history, except records the hotel must keep by law.',
                ),
                DeleteConsequenceRow(
                  icon: Icons.cottage_outlined,
                  text: 'Active cottage bookings or museum passes must still be settled with Concierge.',
                ),
              ],
            ),
          ),
          // Step 3: the typed confirmation. The tick shows once the word matches.
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.xs,
            children: [
              Text.rich(
                TextSpan(
                  style: t.labelSmall?.copyWith(color: p.textMuted, letterSpacing: 0.6),
                  children: [
                    const TextSpan(text: 'TYPE '),
                    TextSpan(
                      text: _phrase,
                      style: TextStyle(color: p.error, fontWeight: FontWeight.w700),
                    ),
                    const TextSpan(text: ' TO CONFIRM'),
                  ],
                ),
              ),
              TextField(
                controller: _controller,
                autocorrect: false,
                enableSuggestions: false,
                textCapitalization: TextCapitalization.characters,
                style: t.labelLarge?.copyWith(letterSpacing: 2),
                decoration: InputDecoration(
                  hintText: _phrase,
                  filled: true,
                  fillColor: p.surfaceAlt,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(IgongoRadius.md),
                    borderSide: BorderSide.none,
                  ),
                  suffixIcon: _confirmed ? Icon(Icons.verified, color: p.error) : null,
                ),
              ),
            ],
          ),
          // Step 4: the actions. Permanently Delete stays disabled until the word matches.
          IgongoButton(
            label: 'Permanently Delete',
            icon: Icons.delete_forever,
            variant: ButtonVariant.danger,
            expand: true,
            onPressed: _confirmed ? () => Navigator.pop(context, true) : null,
          ),
          IgongoButton(
            label: 'Keep My Account',
            variant: ButtonVariant.secondary,
            expand: true,
            onPressed: () => Navigator.pop(context, false),
          ),
          // Step 5: the front-desk row, which opens WhatsApp to the hotel.
          Container(
            padding: const EdgeInsets.all(IgongoSpace.sm),
            decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
            child: Row(
              children: [
                Icon(Icons.support_agent, color: p.secondary),
                const SizedBox(width: IgongoSpace.sm),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Experiencing booking issues?', style: t.labelMedium, overflow: TextOverflow.ellipsis),
                      Text(
                        'Chat with Igongo Front Desk',
                        style: t.bodySmall?.copyWith(color: p.textMuted),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                TextButton.icon(
                  onPressed: () => openWhatsappChat(context, ref),
                  icon: const Icon(Icons.north_east, size: 14),
                  label: const Text('WhatsApp'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
