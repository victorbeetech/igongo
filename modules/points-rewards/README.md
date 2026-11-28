# Points rewards (guests)

A Shein-style points programme for guests. Guests earn points on paid orders
and a sign-up bonus, spend them at checkout once they reach the minimum, and
see when unspent points expire. The super admin sets every rule, and can
switch the whole programme off, in which case guests see no points at all.

## Rules (the super admin changes them on the admin screen)

| Rule | Meaning | Starting value |
| --- | --- | --- |
| `enabled` | The on/off switch. Off: no points UI, nothing earned or spent | `false` |
| `pointsPer1000Ugx` | Points earned per 1,000 UGX paid (rounded down) | `1` |
| `signupBonus` | Points given once at sign-up (0 for none) | `0` |
| `minimumToRedeem` | The fewest points a guest may spend in one go | `100` |
| `ugxPerPoint` | Shillings off for each point spent | `10` |
| `expiryDays` | Days before earned points expire (0 = never) | `365` |

Expiry is set per lot when points are earned, so changing the rule later does
not change points already earned.

## How it works

- **Earning**: `earnForPurchase` gives points for a paid order, keyed by the
  order reference, so a retry never adds them twice. Nothing is earned while
  the programme is off, so switching it on later never back-dates points.
- **Sign-up**: `grantSignupBonus` gives the bonus once per guest. Not yet called by sign-up (needs a hook in the guest sign-up flow).
- **Checkout**: food orders call the `PointsDesk` contract (`pointsDesk`) to spend points, earn when paid in full, and give points back when cancelled.
- **Spending**: `redeemPoints` takes points from the oldest lots first, refuses
  under the minimum or with too few points, and spends each order's points once.
- **Expiry**: `expireDue` removes unspent points from lots past their date and
  writes one history line per lot. It is safe to run again.
- **Manual adjustment**: the super admin adds or takes away points with a note;
  a repeated key is applied once.

## API (`/api/points`)

- `GET /rules`: the public rules, or `{ enabled: false }` while off.
- `GET /me`: my wallet (balance, value, expiring soon, history). Signed in.
- `GET /admin/rules`, `PUT /admin/rules`: read and save every rule.
- `POST /admin/expire`: run expiry now.
- `POST /admin/adjust`: add or take away points by hand.

## Data

Own Postgres schema `points_rewards`: `settings` (the rules), `lots` (each
batch of points), `events` (the history). Each change to a balance is a lot
change and a history line, written in one transaction.

## Permissions

`points-rewards.rules.view`, `points-rewards.rules.edit`,
`points-rewards.points.adjust`. The super admin gets all three (migration 0012).

## Not done yet

- The sign-up bonus hook (see above).
- The guest app points screen and the admin rules screen (separate threads).
- A scheduled run of `expireDue` (for now the super admin runs it from the admin route).
