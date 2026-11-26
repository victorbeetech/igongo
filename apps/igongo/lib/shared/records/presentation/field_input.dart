// One form input for a record field, drawn from the field's kind. Used by
// every records-kit module's add form, so a field the super admin adds
// shows on the phone at once.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../files/photo_picker_field.dart';
import '../../staff/staff_picker_field.dart';
import '../../ui/field/igongo_field.dart';
import '../domain/field_def.dart';

/// The input for [field].
class FieldInput extends StatelessWidget {
  /// Creates the input showing [value].
  const FieldInput({
    super.key,
    required this.field,
    required this.value,
    required this.onChanged,
    required this.module,
    required this.controller,
  });

  /// The field.
  final FieldDef field;

  /// The current value.
  final Object? value;

  /// Called with the new value.
  final ValueChanged<Object?> onChanged;

  /// The module key, for photo uploads.
  final String module;

  /// The text controller for typed kinds (kept by the form).
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final label = field.required ? '${field.label} *' : field.label;
    switch (field.kind) {
      case 'select':
        return DropdownButtonFormField<String>(
          initialValue: field.options.contains(value) ? value as String : null,
          decoration: InputDecoration(labelText: label),
          items: [for (final o in field.options) DropdownMenuItem(value: o, child: Text(o))],
          onChanged: onChanged,
        );
      case 'yesno':
        return SwitchListTile(
          title: Text(field.label),
          value: value == true,
          onChanged: onChanged,
          contentPadding: EdgeInsets.zero,
        );
      case 'staff':
        return StaffPickerField(label: label, value: value as String?, onChanged: onChanged);
      case 'photo':
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: IgongoSpace.xs,
          children: [
            Text(label),
            PhotoPickerField(
              purpose: module,
              value: value == null ? const [] : ['$value'],
              max: 1,
              onChanged: (ids) => onChanged(ids.firstOrNull),
            ),
          ],
        );
      default:
        // Text, long text, numbers, money, dates, times and phones are typed.
        final number = field.kind == 'number' || field.kind == 'money';
        return IgongoField(
          label: label,
          hint: switch (field.kind) {
            'date' => 'YYYY-MM-DD',
            'time' => 'HH:MM',
            'money' => 'UGX',
            _ => null,
          },
          controller: controller,
          lines: field.kind == 'longtext' ? 3 : 1,
          keyboardType: number
              ? TextInputType.number
              : field.kind == 'phone'
              ? TextInputType.phone
              : null,
          onChanged: (t) => onChanged(
            t.isEmpty
                ? null
                : number
                ? num.tryParse(t)
                : t,
          ),
        );
    }
  }
}
