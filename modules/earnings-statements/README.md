# Earnings Statements (module 29)

Payslips and the lifetime earnings statement of each staff member. Spec: [docs/modules/29-earnings-statements.md](../../docs/modules/29-earnings-statements.md).

- **Routes** (`/api/earnings`): `GET /mine`, `GET /mine/payslips/:id`, `GET /mine/export.csv`, `GET /staff/:staffId`, `GET /staff/:staffId/export.csv`.
- No tables of its own: it reads Payroll (`PayHistory`), Bonuses & Rewards (`BonusHistory`) and Advances & Loans (`AdvanceHistory`) through their contracts. Totals per year and for all time: gross, deductions, net, cash bonuses, buffet passes, advances taken and repaid.
- **Permissions**: `earnings-statements.statements.view` (own for every staff member, wider for HR and finance), `.export`.
