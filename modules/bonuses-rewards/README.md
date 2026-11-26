# Bonuses & Rewards (module 31)

Cash bonuses and buffet-access bonuses. Spec: [docs/modules/31-bonuses-rewards.md](../../docs/modules/31-bonuses-rewards.md).

- **Routes** (`/api/bonuses`): `GET /mine`, `GET|POST /`, `POST /:id/decide`, `POST /buffet/redeem`, `GET|PUT /settings`.
- **Cash** bonuses wait for an approver (if the super admin wants), then Payroll adds them to the next pay run and marks them paid.
- **Buffet** bonuses give passes that last a set number of days. The buffet attendant taps the staff card (or scans its QR); one pass a day if the super admin says so. Two stations can never use the last pass twice.
- Nobody gives or approves their own bonus.
- **Contracts**: `CashBonusSource` for Payroll, `BonusHistory` for Earnings Statements. Card taps go through Staff Cards' `CardResolver`.
