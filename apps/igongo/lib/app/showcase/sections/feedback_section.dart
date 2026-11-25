// Showcase: banners, toasts, dialogs, sheets and loaders.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/dialogs/show_dialog_spec.dart';
import '../../../shared/ui/banner/status_banner.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/loader/spiral_loader.dart';
import '../../../shared/ui/skeleton/skeleton_list.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../showcase_section.dart';

/// Sample dialogs, one per tone, drawn by the same dialog and sheet as every screen.
const _samples = [
  DialogSpec(
    id: 'D00-90',
    name: 'Save changes?',
    purpose: 'Your edits go live for every role.',
    slug: 'save',
    tone: DialogTone.confirm,
  ),
  DialogSpec(
    id: 'D00-91',
    name: 'Block this card?',
    purpose: 'The card stops opening doors at once.',
    slug: 'block',
    tone: DialogTone.danger,
  ),
  DialogSpec(
    id: 'D00-92',
    name: 'No connection',
    purpose: 'Saved on this phone; it sends when you are back online.',
    slug: 'offline',
    tone: DialogTone.warning,
  ),
  DialogSpec(id: 'D00-93', name: 'Filter staff', purpose: 'Pick what to show.', slug: 'filter', tone: DialogTone.sheet),
];

/// Every kind of feedback the screens give.
class FeedbackSection extends StatelessWidget {
  /// Creates the section.
  const FeedbackSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ShowcaseSection(
      title: 'Banners, pop-ups and loading',
      children: [
        const StatusBanner(tone: BannerTone.offline, message: 'Offline. Changes are saved on this phone.'),
        const StatusBanner(tone: BannerTone.clientView, message: 'You are seeing the app as a guest sees it.'),
        const StatusBanner(tone: BannerTone.info, message: 'Tip: tap a card to see its holder.'),
        // Each button opens the real dialog, sheet or toast with sample words.
        Wrap(
          spacing: IgongoSpace.sm,
          runSpacing: IgongoSpace.sm,
          children: [
            for (final d in _samples)
              IgongoButton(
                label: d.tone.name[0].toUpperCase() + d.tone.name.substring(1),
                variant: ButtonVariant.secondary,
                onPressed: () => showDialogSpec(context, d, const ['Department', 'Shift'], (_) {}),
              ),
            IgongoButton(
              label: 'Toast',
              variant: ButtonVariant.secondary,
              onPressed: () => showIgongoToast(context, 'Saved', action: 'Undo'),
            ),
          ],
        ),
        const Center(child: SpiralLoader()),
        const SkeletonList(rows: 2),
      ],
    );
  }
}
