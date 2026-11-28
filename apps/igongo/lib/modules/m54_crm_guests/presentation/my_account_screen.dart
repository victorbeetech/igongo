// S54-05..07 Edit Profile, live: the guest's name, phone, email, accommodation,
// likes and allergies, the messages they agree to get, and the profile photo
// (picked, cropped, then saved). The server checks every detail; a refused one
// shows its sentence in a toast. Signed out, the prototype design shows.
// The accommodation is not wired yet.

import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:image_picker/image_picker.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/catalog/catalog.dart';
import '../../../shared/files/crop_photo_screen.dart';
import '../../../shared/files/profile_photo_providers.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/crm_providers.dart';
import '../domain/guest_profile.dart';
import 'edit_profile/edit_profile_top_bar.dart';
import 'edit_profile/message_choices_card.dart';
import 'edit_profile/personal_help_banner.dart';
import 'edit_profile/personal_info_card.dart';
import 'edit_profile/preferences_card.dart';
import 'edit_profile/profile_photo_editor.dart';
import 'edit_profile/royal_member_label.dart';

/// Edit Profile, reached from the Me tab.
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
    builder: (context, profile, _) => _AccountForm(profile: profile),
  );
}

/// The editable form, filled from [profile].
class _AccountForm extends ConsumerStatefulWidget {
  const _AccountForm({required this.profile});

  /// The profile the form starts from.
  final GuestProfile profile;

  @override
  ConsumerState<_AccountForm> createState() => _AccountFormState();
}

class _AccountFormState extends ConsumerState<_AccountForm> {
  // Step 1: one text box per detail, filled from the profile. The accommodation
  // box has no saved value yet, so it starts empty.
  late final _name = TextEditingController(text: widget.profile.name);
  late final _phone = TextEditingController(text: widget.profile.phone ?? '');
  late final _email = TextEditingController(text: widget.profile.contactEmail ?? '');
  final _accommodation = TextEditingController();
  late final _likes = TextEditingController(text: widget.profile.preferences ?? '');
  late final _allergies = TextEditingController(text: widget.profile.allergies ?? '');

  // Step 2: the message choices, filled from the profile.
  late bool _sms = widget.profile.sms;
  late bool _whatsapp = widget.profile.whatsapp;
  late bool _emailMessages = widget.profile.email;

  @override
  void dispose() {
    for (final c in [_name, _phone, _email, _accommodation, _likes, _allergies]) {
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

  /// Picks a photo, lets the person crop it, then saves it to their account.
  Future<void> _changePhoto() async {
    // Step 1: pick a picture from the phone.
    final file = await ImagePicker().pickImage(source: ImageSource.gallery, maxWidth: 1600, imageQuality: 90);
    if (file == null || !mounted) return;
    final bytes = await file.readAsBytes();
    if (!mounted) return;
    // Step 2: crop it to a round photo. Cancel returns null and nothing is saved.
    final cropped = await Navigator.of(context).push<Uint8List>(MaterialPageRoute(builder: (_) => CropPhotoScreen(source: bytes)));
    if (cropped == null || !mounted) return;
    // Step 3: save it, then reload the photo so the avatar shows it.
    try {
      await ref.read(profilePhotoApiProvider).save(cropped);
      ref.invalidate(currentProfilePhotoProvider);
      if (mounted) showIgongoToast(context, 'Profile photo saved.');
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
  }

  /// Leaves the screen without saving.
  void _discard() => Navigator.of(context).maybePop();

  @override
  Widget build(BuildContext context) {
    // Step 4: my saved photo, or null while it loads or when I have none.
    final photo = ref.watch(currentProfilePhotoProvider).valueOrNull;
    return _form(context, photo);
  }

  /// The form itself, showing [photo] in the avatar.
  Widget _form(BuildContext context, Uint8List? photo) => Column(
    children: [
      // Step 5: the top bar, which follows the name as it is typed.
      ListenableBuilder(
        listenable: _name,
        builder: (context, _) => EditProfileTopBar(name: _name.text),
      ),
      Expanded(
        child: ScreenListView(
          children: [
            Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: IgongoSpace.lg,
                children: [
                  const RoyalMemberLabel(),
                  ListenableBuilder(
                    listenable: _name,
                    builder: (context, _) => ProfilePhotoEditor(name: _name.text, onChangePhoto: _changePhoto, photo: photo),
                  ),
                  PersonalInfoCard(name: _name, phone: _phone, email: _email, accommodation: _accommodation),
                  PreferencesCard(likes: _likes, allergies: _allergies),
                  MessageChoicesCard(
                    sms: _sms,
                    whatsapp: _whatsapp,
                    email: _emailMessages,
                    onSms: (v) => setState(() => _sms = v),
                    onWhatsapp: (v) => setState(() => _whatsapp = v),
                    onEmail: (v) => setState(() => _emailMessages = v),
                  ),
                  IgongoButton(label: 'Save Changes', icon: Icons.check, expand: true, onPressed: _save),
                  TextButton(onPressed: _discard, child: const Text('Discard Changes')),
                  const PersonalHelpBanner(),
                ],
              ),
            ),
          ],
        ),
      ),
    ],
  );
}
