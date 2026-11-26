// Times as people read them in the app, such as "26 Nov, 14:05", in the
// phone's own time zone.

const _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// [at] as "26 Nov, 14:05".
String dayTime(DateTime at) {
  final t = at.toLocal();
  String two(int n) => n.toString().padLeft(2, '0');
  return '${t.day} ${_months[t.month - 1]}, ${two(t.hour)}:${two(t.minute)}';
}
