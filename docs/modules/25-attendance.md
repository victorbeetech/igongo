# 25. Attendance

**Group:** Staff · **Module key:** `attendance` · [All modules](README.md)

## Summary

Strong, hard-to-cheat attendance. Staff tap their NFC card or scan their QR code at the gate and stations, and the system works out lateness, absence and overtime automatically.

## Features

### Clocking
- Tap card or scan QR at the gate, reception or any station set up in [Devices & Stations](18-devices-stations.md).
- Photo taken on each tap, to stop one person clocking for another.
- Optional face match against the profile photo.
- GPS and network check for mobile clock-in by roles that work away from stations, such as riders and drivers.
- Break out and break in.
- Works offline and syncs later, with the original tap time kept.

### Rules
- Expected times come from [Shifts & Rosters](26-shifts-rosters.md).
- Grace period, late, very late, early leave, absent and overtime, all automatic.
- Missed tap alerts to the person and their supervisor.
- Correction requests with a reason, sent for approval.
- Holidays and approved leave are respected automatically.

### Live board
- Who is on duty now, by department, with photos.
- Who is late or absent today.
- Headcount for emergencies and fire roll call.

### Records
- Daily, weekly and monthly attendance sheets.
- Hours worked and overtime, sent to payroll after supervisor approval.
- Attendance score per person over time.

## Super admin options
- Grace periods, lateness thresholds and overtime rules, per department or role.
- Which clock-in methods each role may use.
- Whether a photo or face match is required.
- GPS zones for mobile clock-in.
- Who can approve corrections, and the deadline for them.


## Depends on

- [NFC & QR Staff Cards](16-staff-cards.md)
- [Devices & Stations](18-devices-stations.md)
- [HR Staff Records](22-hr-records.md)
- [Shifts & Rosters](26-shifts-rosters.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `attendance.clocked_in`
- `attendance.clocked_out`
- `attendance.late`
- `attendance.absent`
- `attendance.missed_tap`
- `attendance.corrected`
- `attendance.period_approved`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
