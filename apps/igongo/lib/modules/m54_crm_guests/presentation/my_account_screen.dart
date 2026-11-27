// S54-05..07 My account, live: my name, phone, email, likes and allergies, and
// the messages I agree to get (SMS, WhatsApp, email). The server checks every
// detail; a refused one shows its sentence in a toast. Signed out, the
// prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/catalog/catalog.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/section/section_header.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/crm_providers.dart';
import '../domain/guest_profile.dart';

/// My account.
class MyAccountScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyAccountScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<GuestProfile>(
    screenName: screen.spec.name,
    value: ref.watch(myProfileProvider),
    onRetry: () => ref.invalidate(myProfileProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, profile, _) => _AccountForm(screen: screen, profile: profile),
  );
}

/// The editable form, filled from [profile].
class _AccountForm extends ConsumerStatefulWidget {
  const _AccountForm({required this.screen, required this.profile});

  /// The screen's context, for its purpose line.
  final ScreenContext screen;

  /// The profile the form starts from.
  final GuestProfile profile;

  @override
  ConsumerState<_AccountForm> createState() => _AccountFormState();
}

class _AccountFormState extends ConsumerState<_AccountForm> {
  // Step 1: one text box per detail, filled from the profile.
  late final _name = TextEditingController(text: widget.profile.name);
  late final _phone = TextEditingController(text: widget.profile.phone ?? '');
  late final _email = TextEditingController(text: widget.profile.contactEmail ?? '');
  late final _likes = TextEditingController(text: widget.profile.preferences ?? '');
  late final _allergies = TextEditingController(text: widget.profile.allergies ?? '');

  // Step 2: the message choices, filled from the profile.
  late bool _sms = widget.profile.sms;
  late bool _whatsapp = widget.profile.whatsapp;
  late bool _emailMessages = widget.profile.email;

  @override
  void dispose() {
    for (final c in [_name, _phone, _email, _likes, _allergies]) {
      c.dispose();
    }
    super.dispose();
  }

  /// Text of [c], or null when empty (null clears the field on the server).
  static String? _text(TextEditingController c) => c.text.trim().isEmpty ? null : c.text.trim();

  /// Saves the details, then the message choices. A refused value shows the server's sentence.
  Future<void> _save() async {
    final api = ref.read(crmApiProvider);
    try {
      // Step 3: the details; the server checks name, phone and email.
      await api.save(
        name: _name.text.trim(),
        phone: _text(_phone),
        email: _text(_email),
        preferences: _text(_likes),
        allergies: _text(_allergies),
      );
      // Step 4: the message choices, with the time the server records.
      await api.consent(sms: _sms, whatsapp: _whatsapp, email: _emailMessages);
      ref.invalidate(myProfileProvider);
      if (mounted) showIgongoToast(context, 'Saved');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
  }

  @override
  Widget build(BuildContext context) => ScreenListView(
    children: [
      PurposeText(widget.screen.spec.purpose),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
        child: Column(
          spacing: IgongoSpace.md,
          children: [
            IgongoField(label: 'Name', controller: _name),
            IgongoField(label: 'Phone', controller: _phone, keyboardType: TextInputType.phone),
            IgongoField(label: 'Email', controller: _email, keyboardType: TextInputType.emailAddress),
            IgongoField(label: 'What I like', controller: _likes, lines: 3),
            IgongoField(label: 'Allergies', controller: _allergies),
          ],
        ),
      ),
      const SectionHeader('Messages I agree to get'),
      SwitchListTile(title: const Text('SMS'), value: _sms, onChanged: (v) => setState(() => _sms = v)),
      SwitchListTile(title: const Text('WhatsApp'), value: _whatsapp, onChanged: (v) => setState(() => _whatsapp = v)),
      SwitchListTile(title: const Text('Email'), value: _emailMessages, onChanged: (v) => setState(() => _emailMessages = v)),
      Padding(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        child: IgongoButton(label: 'Save', expand: true, onPressed: _save),
      ),
    ],
  );
}
