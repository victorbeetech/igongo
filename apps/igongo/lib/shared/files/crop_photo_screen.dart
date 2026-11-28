// A round crop for a profile photo. The person drags and pinches the picture
// under a circular frame, then taps Use photo. The visible circle square is
// captured as a PNG and returned to the caller. The dark shade is drawn
// outside the captured area, so the saved picture is clean.

import 'dart:typed_data';
import 'dart:ui' show ImageByteFormat;

import 'package:flutter/rendering.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';
import '../ui/toast/igongo_toast.dart';

/// Crops [source] to a round profile photo. Pops with the PNG bytes, or with null on cancel.
class CropPhotoScreen extends StatefulWidget {
  /// Creates the crop screen for the picture [source].
  const CropPhotoScreen({super.key, required this.source});

  /// The picture the person chose, as bytes (JPG or PNG).
  final Uint8List source;

  @override
  State<CropPhotoScreen> createState() => _CropPhotoScreenState();
}

class _CropPhotoScreenState extends State<CropPhotoScreen> {
  /// Side of the square crop, in logical pixels. The circle fits inside it.
  static const double _frame = 280;

  /// Wraps the cropped area, so it can be captured as an image.
  final GlobalKey _captureKey = GlobalKey();

  /// Set while the picture is being captured, so the button shows it is busy.
  bool _busy = false;

  /// Captures the square under the circle and pops it as PNG bytes.
  Future<void> _use() async {
    setState(() => _busy = true);
    try {
      // Step 1: find the boundary around the square and capture it as an image.
      final boundary = _captureKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      final image = await boundary?.toImage(pixelRatio: 1);
      // Step 2: encode it as PNG bytes for the caller to upload.
      final data = await image?.toByteData(format: ImageByteFormat.png);
      if (!mounted) return;
      if (data == null) {
        showIgongoToast(context, 'The photo could not be cropped. Try another one.');
        setState(() => _busy = false);
        return;
      }
      Navigator.of(context).pop(data.buffer.asUint8List());
    } on Exception {
      if (!mounted) return;
      showIgongoToast(context, 'The photo could not be cropped. Try another one.');
      setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      backgroundColor: p.background,
      appBar: AppBar(
        title: const Text('Crop photo'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          tooltip: 'Cancel',
          onPressed: _busy ? null : () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: IgongoSpace.lg,
            children: [
              Text('Drag and pinch to reposition', style: context.text.bodyMedium),
              // Step 3: the picture moves and zooms inside the square, which is captured.
              Stack(
                alignment: Alignment.center,
                children: [
                  RepaintBoundary(
                    key: _captureKey,
                    child: SizedBox(
                      width: _frame,
                      height: _frame,
                      child: ClipRect(
                        child: InteractiveViewer(
                          minScale: 1,
                          maxScale: 4,
                          child: SizedBox(
                            width: _frame,
                            height: _frame,
                            child: Image.memory(widget.source, fit: BoxFit.cover, gaplessPlayback: true),
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Step 4: the shade and the ring sit above the capture, so they are not saved.
                  IgnorePointer(
                    child: Container(
                      width: _frame,
                      height: _frame,
                      decoration: BoxDecoration(
                        border: Border.all(color: p.onPrimary, width: 3),
                        borderRadius: BorderRadius.circular(_frame / 2),
                        boxShadow: [BoxShadow(color: p.text.withValues(alpha: 0.35), spreadRadius: 1000)],
                      ),
                    ),
                  ),
                ],
              ),
              IgongoButton(
                label: _busy ? 'Saving…' : 'Use photo',
                icon: Icons.check,
                expand: true,
                onPressed: _busy ? null : _use,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
