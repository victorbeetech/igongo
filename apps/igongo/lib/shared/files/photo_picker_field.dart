// Take or choose photos and upload them straight away. Shows how many are
// attached, with a way to clear them, so a form only keeps photo IDs.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:image_picker/image_picker.dart';
import 'package:material_ui/material_ui.dart';

import '../session/session_controller.dart';
import '../ui/button/igongo_button.dart';
import '../ui/toast/igongo_toast.dart';
import 'upload_photo.dart';

/// A photo field holding uploaded photo IDs.
class PhotoPickerField extends ConsumerStatefulWidget {
  /// Creates the field for the module [purpose].
  const PhotoPickerField({
    super.key,
    required this.purpose,
    required this.value,
    required this.onChanged,
    this.max = 5,
  });

  /// The module the photos are for, such as `faults-maintenance`.
  final String purpose;

  /// The uploaded photo IDs.
  final List<String> value;

  /// Called with the new list of IDs.
  final ValueChanged<List<String>> onChanged;

  /// The most photos allowed.
  final int max;

  @override
  ConsumerState<PhotoPickerField> createState() => _PhotoPickerFieldState();
}

class _PhotoPickerFieldState extends ConsumerState<PhotoPickerField> {
  bool _busy = false;

  /// Takes a photo with the camera (or picks one), then uploads it.
  Future<void> _add(ImageSource source) async {
    final file = await ImagePicker().pickImage(source: source, maxWidth: 1600, imageQuality: 80);
    if (file == null) return;
    setState(() => _busy = true);
    try {
      final id = await uploadPhoto(ref.read(apiClientProvider), file, widget.purpose);
      widget.onChanged([...widget.value, id]);
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final full = widget.value.length >= widget.max;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.sm,
      children: [
        Text(_busy ? 'Uploading…' : '${widget.value.length} photo${widget.value.length == 1 ? '' : 's'} added'),
        Wrap(
          spacing: IgongoSpace.sm,
          children: [
            IgongoButton(
              label: 'Take photo',
              icon: Icons.photo_camera_outlined,
              variant: ButtonVariant.secondary,
              onPressed: _busy || full ? null : () => _add(ImageSource.camera),
            ),
            IgongoButton(
              label: 'Choose photo',
              icon: Icons.photo_library_outlined,
              variant: ButtonVariant.secondary,
              onPressed: _busy || full ? null : () => _add(ImageSource.gallery),
            ),
            if (widget.value.isNotEmpty)
              IgongoButton(label: 'Clear', variant: ButtonVariant.text, onPressed: () => widget.onChanged(const [])),
          ],
        ),
      ],
    );
  }
}
