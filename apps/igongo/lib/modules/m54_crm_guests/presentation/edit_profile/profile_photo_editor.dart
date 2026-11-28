// The centred avatar with a camera badge, the "Change photo" link and the file
// rules. The avatar shows the saved photo when there is one, else the initial.

import 'dart:typed_data';

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/initials.dart';
import '../../../../../shared/theme/theme.dart';

/// The profile photo with its change controls.
class ProfilePhotoEditor extends StatelessWidget {
  /// Creates the editor for [name]. [onChangePhoto] runs when a change control is tapped.
  const ProfilePhotoEditor({super.key, required this.name, required this.onChangePhoto, this.photo});

  /// The person's name; its first initial shows until a photo exists.
  final String name;

  /// The saved profile photo bytes, or null to show the initial.
  final Uint8List? photo;

  /// What a tap on the avatar or the link does.
  final VoidCallback onChangePhoto;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final initial = initialsOf(name);
    return Column(
      spacing: IgongoSpace.xs,
      children: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            // Step 1: the round avatar, with a soft ring around it.
            Container(
              width: 96,
              height: 96,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: p.primary,
                shape: BoxShape.circle,
                border: Border.all(color: p.surfaceAlt, width: 4),
              ),
              clipBehavior: Clip.antiAlias,
              child: photo == null
                  ? Text(initial, style: context.text.displaySmall?.copyWith(color: p.onPrimary))
                  : Image.memory(photo!, fit: BoxFit.cover, width: 96, height: 96, gaplessPlayback: true),
            ),
            // Step 2: the camera badge on the lower right edge.
            Positioned(
              right: 0,
              bottom: 0,
              child: Material(
                color: p.primary,
                shape: CircleBorder(side: BorderSide(color: p.background, width: 2)),
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: onChangePhoto,
                  child: SizedBox(
                    width: 32,
                    height: 32,
                    child: Icon(Icons.photo_camera, size: 18, color: p.onPrimary),
                  ),
                ),
              ),
            ),
          ],
        ),
        // Step 3: the link and the file rules under it.
        TextButton(onPressed: onChangePhoto, child: const Text('Change photo')),
        Text('JPG, PNG under 5MB', style: context.text.bodySmall),
      ],
    );
  }
}
