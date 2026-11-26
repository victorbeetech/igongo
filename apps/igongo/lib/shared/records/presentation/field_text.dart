// A saved field value as people read it: money in UGX, yes/no in words, a
// photo as "Photo attached", and an empty value as a dash.

import '../../format/ugx.dart';
import '../domain/field_def.dart';

/// [value] of [field] in words.
String fieldText(FieldDef field, Object? value) {
  if (value == null || value == '') return '-';
  return switch (field.kind) {
    'yesno' => value == true ? 'Yes' : 'No',
    'money' => ugx((value as num).round()),
    'photo' => 'Photo attached',
    _ => '$value',
  };
}
