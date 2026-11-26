// S40-04 Fault detail, live: the report, who has it, the steps I may take
// (start, fix, close, reopen; the API checks who may), likes and comments.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/social/comment_box.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/fault_providers.dart';
import '../../domain/fault_page.dart';

/// The next steps offered from each status.
const _steps = <String, List<(String, String)>>{
  'open': [('in_progress', 'Start work')],
  'assigned': [('in_progress', 'Start work'), ('fixed', 'Mark fixed')],
  'in_progress': [('on_hold', 'Put on hold'), ('fixed', 'Mark fixed')],
  'on_hold': [('in_progress', 'Resume'), ('fixed', 'Mark fixed')],
  'fixed': [('closed', 'Close'), ('in_progress', 'Reopen')],
  'closed': [('in_progress', 'Reopen')],
};

/// One fault.
class FaultDetailScreen extends ConsumerWidget {
  /// Creates the screen for fault [id].
  const FaultDetailScreen({super.key, required this.id});

  /// The fault's ID.
  final String id;

  /// Runs [call], shows a refusal as a toast, then reloads the fault.
  Future<void> _act(BuildContext context, WidgetRef ref, Future<void> Function() call) async {
    try {
      await call();
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(faultProvider(id));
    ref.invalidate(myFaultsProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final api = ref.read(faultsApiProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Fault')),
      body: LiveView<FaultPage>(
        screenName: 'Fault',
        value: ref.watch(faultProvider(id)),
        onRetry: () => ref.invalidate(faultProvider(id)),
        sample: (_) => const SizedBox.shrink(),
        builder: (context, page, session) {
          final f = page.fault;
          return ScreenListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.sm,
                  children: [
                    Text('${f.number} · ${f.title}', style: context.text.titleLarge),
                    StatusChip(statusWords(f.status)),
                    Text(
                      [
                        statusWords(f.priority),
                        f.location,
                        'Reported by ${f.reportedBy}',
                        dayTime(f.createdAt),
                      ].whereType<String>().join(' · '),
                      style: context.text.bodySmall,
                    ),
                    if (f.description.isNotEmpty) Text(f.description),
                    Text(f.assignedTo == null ? 'Not assigned yet' : 'Assigned to ${f.assignedTo}'),
                    if (f.photoCount > 0) Text('${f.photoCount} photo${f.photoCount == 1 ? '' : 's'} attached'),
                    if (page.likesOn && (session?.can('faults-maintenance.faults.like') ?? false))
                      IgongoButton(
                        label: '${page.likes} like${page.likes == 1 ? '' : 's'}',
                        icon: Icons.favorite_border,
                        variant: ButtonVariant.text,
                        onPressed: () => _act(context, ref, () => api.toggleLike(id)),
                      ),
                    Wrap(
                      spacing: IgongoSpace.sm,
                      runSpacing: IgongoSpace.sm,
                      children: [
                        for (final (to, label) in _steps[f.status] ?? const <(String, String)>[])
                          IgongoButton(label: label, onPressed: () => _act(context, ref, () => api.move(id, to, null))),
                      ],
                    ),
                  ],
                ),
              ),
              if (page.commentsOn)
                CommentBox(
                  comments: page.comments,
                  canComment: (session?.can('faults-maintenance.faults.comment') ?? false),
                  onSend: (body) async {
                    await api.comment(id, body);
                    ref.invalidate(faultProvider(id));
                  },
                ),
            ],
          );
        },
      ),
    );
  }
}
