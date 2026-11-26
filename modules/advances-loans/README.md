# Advances & Loans (module 30)

Salary advances and staff loans. Spec: [docs/modules/30-advances-loans.md](../../docs/modules/30-advances-loans.md).

- **Routes** (`/api/advances`): `GET|POST /mine`, `POST /mine/:id/cancel`, `GET /`, `GET|PUT /settings`, `GET /:id`, `POST /:id/decide`, `POST /:id/disburse`, `POST /:id/repay`.
- **Life**: requested, approved or declined (never by the person themselves), disbursed, repaid. Payroll takes one instalment a month from the start month; cash repayments are allowed too.
- **Rules** (super admin): advances and loans each on or off, the largest amount, the most months, one open at a time.
- **Contracts**: `AdvanceRecovery` for Payroll, `AdvanceHistory` for Earnings Statements.
