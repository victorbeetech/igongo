# 31. Bonuses & Rewards

**Group:** Staff · **Module key:** `bonuses-rewards` · [All modules](README.md)

## Summary

Rewards for staff: cash bonuses, buffet access, vouchers and recognition, each with the reason recorded.

## Features
- Cash bonus to one person, a team or a department, paid through payroll or separately.
- Buffet bonus: a one-time or repeated buffet access that the person redeems with one card tap at the buffet.
- Other rewards: day off, pool or spa pass, shop voucher.
- Employee of the month, with nomination and voting if wanted.
- Reason and approver recorded for every reward.
- Reward history on each staff profile.
- Recognition posts to the [Notice Board](49-notice-board.md) if the person agrees.

## Super admin options
- Reward types and their rules (such as expiry date for a buffet bonus).
- Who can give rewards and with what approval tier.
- Whether rewards are announced publicly.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [NFC & QR Staff Cards](16-staff-cards.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `bonus.awarded`
- `bonus.redeemed`
- `bonus.expired`
- `award.announced`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
