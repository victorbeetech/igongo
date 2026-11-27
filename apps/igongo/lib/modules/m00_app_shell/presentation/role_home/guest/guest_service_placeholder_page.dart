// The placeholder page for a guest service that has no screen yet (Spa, Pool). It
// shows the service's name and a short "coming soon" line in the theme's text styles,
// until the real screen is built.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A plain page with the service name and a note that it is coming soon.
class GuestServicePlaceholderPage extends StatelessWidget {
  /// Creates the page for the service called [title].
  const GuestServicePlaceholderPage({super.key, required this.title});

  /// The service's name, shown in the app bar and as the heading.
  final String title;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        // Step 1: a centred column with an icon, the service name and the note.
        child: Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.hourglass_empty, size: IgongoSpace.xl, color: p.primary),
              const SizedBox(height: IgongoSpace.md),
              Text(
                title,
                textAlign: TextAlign.center,
                style: context.text.titleLarge?.copyWith(color: p.text, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: IgongoSpace.xs),
              Text(
                'This service is coming soon.',
                textAlign: TextAlign.center,
                style: context.text.bodyMedium?.copyWith(color: p.textMuted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
