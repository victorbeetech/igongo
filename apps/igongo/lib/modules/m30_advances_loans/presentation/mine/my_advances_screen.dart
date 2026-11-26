// S30-01 My advances, live: my advances and loans, what is left to repay,
// a button to ask for one and a way to take back an undecided request.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/advance_providers.dart';
import '../../domain/my_advances.dart';
import '../request/request_advance_screen.dart';

/// My advances.
class MyAdvancesScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyAdvancesScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<MyAdvances>(
    screenName: screen.spec.name,
    value: ref.watch(myAdvancesProvider),
    onRetry: () => ref.invalidate(myAdvancesProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, page, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myAdvancesProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: IgongoButton(
              label: 'Ask for an advance',
              expand: true,
              onPressed: page.advance.enabled || page.loan.enabled
                  ? () =>
                        Navigator.of(context)
                            .push(MaterialPageRoute<void>(builder: (_) => RequestAdvanceScreen(page: page)))
                  : null,
            ),
          ),
          if (page.items.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No advances or loans.')),
          for (final a in page.items)
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
              child: IgongoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    Row(
                      spacing: IgongoSpace.sm,
                      children: [
                        Expanded(
                          child: Text(
                            '${a.number} · ${statusWords(a.kind)} of ${ugx(a.amount)}',
                            style: context.text.titleSmall,
                          ),
                        ),
                        StatusChip(statusWords(a.status)),
                      ],
                    ),
                    Text(
                      '${a.instalments} × ${ugx(a.instalmentAmount)} from ${a.startPeriod} · left ${ugx(a.left)}',
                      style: context.text.bodySmall,
                    ),
                    Text(a.reason),
                    if (a.decisionNote != null) Text(a.decisionNote!, style: context.text.bodySmall),
                    if (a.status == 'requested')
                      IgongoButton(
                        label: 'Take back',
                        variant: ButtonVariant.text,
                        onPressed: () async {
                          try {
                            await ref.read(advancesApiProvider).cancel(a.id);
                          } on Exception catch (e) {
                            if (context.mounted) showIgongoToast(context, '$e');
                          }
                          ref.invalidate(myAdvancesProvider);
                        },
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    ),
  );
}
