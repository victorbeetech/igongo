// The QR code on a ticket: a real, scannable code drawn as vectors, so it stays
// sharp at any size, on the shared white panel. An optional caption sits under it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../theme/theme.dart';
import 'ticket_code_panel.dart';

/// A QR code that holds [data], drawn [size] pixels square, with an optional [caption].
class TicketQrCode extends StatelessWidget {
  /// Creates the code.
  const TicketQrCode({super.key, required this.data, required this.size, this.caption});

  /// The text the code holds, such as a booking code or a pass number.
  final String data;

  /// The side of the square code, in logical pixels.
  final double size;

  /// Small text under the code, or null for none.
  final String? caption;

  @override
  Widget build(BuildContext context) {
    // Step 1: read the caption once, so the optional line is shown only when there is one.
    final label = caption;
    return TicketCodePanel(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step 2: draw the code. Error correction M lets it scan through a little glare or smudging.
          QrImageView(
            data: data,
            size: size,
            errorCorrectionLevel: QrErrorCorrectLevel.M,
            eyeStyle: const QrEyeStyle(color: IgongoColorsLight.brandInk),
            dataModuleStyle: const QrDataModuleStyle(color: IgongoColorsLight.brandInk),
          ),
          // Step 3: the caption, in dark ink because it sits on the white panel in both modes.
          if (label != null) ...[
            const SizedBox(height: IgongoSpace.xs),
            Text(
              label,
              style: context.text.labelSmall?.copyWith(color: IgongoColorsLight.brandInk),
            ),
          ],
        ],
      ),
    );
  }
}
