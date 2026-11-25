# 32. Staff Meals

**Group:** Staff · **Module key:** `staff-meals` · [All modules](README.md)

## Summary

Daily staff meals claimed with a card tap, with counts for the kitchen and no double claims.

## Features
- Meal entitlement per role and shift (such as lunch for day shift, supper for night shift).
- Claim by tapping a card at the staff canteen station.
- Blocks a second claim for the same meal.
- Guests of staff and special diets, if allowed.
- Daily menu for the staff canteen in the app.
- Forecast for the kitchen from the roster: how many staff meals today.
- Report of meals served per day, department and person.

## Super admin options
- Meal times, entitlements and who qualifies.
- Whether staff on leave or off duty can claim.
- Whether a missed meal can be taken later.


## Depends on

- [NFC & QR Staff Cards](16-staff-cards.md)
- [Shifts & Rosters](26-shifts-rosters.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `meal.claimed`
- `meal.claim_denied`
- `meal.forecast_ready`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
