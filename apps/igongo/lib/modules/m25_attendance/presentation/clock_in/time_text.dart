// Times as staff read them: "08:05" (24-hour, the phone's own time).

/// [at] as `HH:MM`.
String timeText(DateTime at) => '${at.hour.toString().padLeft(2, '0')}:${at.minute.toString().padLeft(2, '0')}';
