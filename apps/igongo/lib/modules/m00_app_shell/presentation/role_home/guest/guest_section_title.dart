// A section title on the guest home ("From our kitchen", "Explore Igongo"), in the
// brand red, with an optional link on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The title row for a guest home section.
class GuestSectionTitle extends StatelessWidget {
  /// Creates the title; [action] and [onAction] add a link on the right.
  const GuestSectionTitle(this.title, {super.key, this.action, this.onAction});

  /// The section name.
  final String title;

  /// The link's words, such as "Full menu".
  final String? action;

  /// What the link does.
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.sm),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: context.text.titleLarge?.copyWith(color: p.primary, fontWeight: FontWeight.w700),
            ),
          ),
          if (action != null)
            TextButton(
              onPressed: onAction,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(action!, style: context.text.labelLarge?.copyWith(color: p.primary)),
                  const SizedBox(width: IgongoSpace.xxs),
                  Icon(Icons.arrow_forward, size: IgongoSpace.md, color: p.primary),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
