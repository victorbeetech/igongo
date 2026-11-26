// Pick one active staff member from HR Records, for any module's form
// (such as "Give it to" or a record's staff field). The value is a staff ID.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../api/api_client.dart';
import '../session/session_controller.dart';
import 'staff_ref.dart';

/// Everyone active (up to 200), shared by every picker.
final activeStaffProvider = FutureProvider.autoDispose<List<StaffRef>>((ref) async {
  ref.watch(sessionProvider);
  final json = await ref.watch(apiClientProvider).get('/api/hr/staff?status=active&limit=200');
  return [for (final s in json['items'] as List<dynamic>) StaffRef.fromJson(s as Json)];
});

/// A staff dropdown.
class StaffPickerField extends ConsumerWidget {
  /// Creates the picker labelled [label] showing [value].
  const StaffPickerField({super.key, required this.label, required this.value, required this.onChanged});

  /// The label.
  final String label;

  /// The chosen staff ID, or null.
  final String? value;

  /// Called with the new staff ID.
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final staff = ref.watch(activeStaffProvider);
    final items = staff.valueOrNull ?? const <StaffRef>[];
    return DropdownButtonFormField<String>(
      initialValue: items.any((s) => s.staffId == value) ? value : null,
      decoration: InputDecoration(labelText: label, helperText: staff.hasError ? 'Staff list unavailable' : null),
      items: [for (final s in items) DropdownMenuItem(value: s.staffId, child: Text('${s.name} (${s.staffNumber})'))],
      onChanged: onChanged,
    );
  }
}
