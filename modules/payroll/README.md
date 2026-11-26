# Payroll (module 28)

Monthly pay. Spec: [docs/modules/28-payroll.md](../../docs/modules/28-payroll.md).

- **Routes** (`/api/payroll`): `GET /profiles`, `PUT /profiles/:staffId`, `GET|POST /runs`, `GET /runs/:id`, `GET /runs/:id/export.csv`, `POST /runs/:id/recalculate|approve|paid|cancel`, `PUT /payslips/:id/adjustments`, `GET|PUT /settings`.
- **Pay profile** per staff member: basic salary, allowances, pay method and account.
- **Pay run** per month: draft (recalculate and adjust), approved (by someone other than the maker, if the super admin says so), paid. Paying settles the cash bonuses (Bonuses & Rewards) and advance instalments (Advances & Loans) through their contracts.
- **Deductions** are all set by the super admin: percent, fixed or tax bands, on gross or basic, with an employer share. No rates are built in; the hotel's accountant gives them.
- Staff see their own payslips through Earnings Statements (`PayHistory` contract).
