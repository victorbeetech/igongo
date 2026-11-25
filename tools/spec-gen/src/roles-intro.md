# Roles spec

These are the pre-made roles for the Igongo app. **Roles are data, not code.** Each one is a starting template that the super admin can rename, edit, clone or delete in [Roles & Permissions](../modules/02-roles-permissions.md), and new roles (any name, any department) can be created the same way. Nothing here needs a developer to change.

## One app, one entry point

- There is **one Igongo app** for everyone: the board, the CEO, managers, staff, riders and clients. There is no separate staff app, rider app or guest app.
- Everyone opens the same app and uses the **same login screen**. Accounts are registered through the super admin's rules: staff from HR records, clients by sign-up, at the front desk or from a booking.
- After login, the app reads the person's roles and **builds their interface**: menus, home tiles, screens and actions. Two people with different roles see two different apps.
- A person can hold **several roles**, such as Receptionist plus Cashier, or Pool Attendant plus Museum Guide. Their permissions, menus and home tiles add together, so one person sees the pool work and the museum work in one app.
- **The super admin makes the final roles.** These pre-made roles are starting points. The super admin can create any new role, combine duties, split them, rename them and give one person any mix of roles, because only the hotel knows who really does what.
- **Every staff role can switch to the client view** to see the app exactly as a guest sees it, then switch back. Orders made there are marked as staff orders.
- The web portal uses the same roles, for work that suits a big screen.

## How to read a role file

Each role file lists:

- **Purpose**: what the role is for.
- **Reports to**: the role above it, used for approvals and the organisation chart.
- **Home screen tiles**: what the person sees first in the app.
- **Modules, screens and default permissions**: which modules the role can use, which actions, and on whose records.
- **Approval limits**: what it can approve, using tiers.
- **Extra rules**: 2FA, devices, time limits and other conditions.

Every staff role also includes the [Every Staff Member (base role)](staff-base.md), which gives self-service: my attendance, shifts, leave, payslips, meals, notices, chat and fault reporting.

### Actions

view, create, edit, approve, delete, export, comment, like. These are the same in every module.

### Data scope

| Scope | Meaning |
| --- | --- |
| Everything | All records in the module |
| Own department | Records of the role's department |
| Own team | Records of the people who report to this person |
| Assigned to them | Only records assigned to this person, such as their deliveries |
| Own records | Only this person's own records |
| Public items | Items open to the public, such as the menu |

### Approval tiers

Amounts are not written into the code. The super admin sets the amount behind each tier in [Roles & Permissions](../modules/02-roles-permissions.md), and can change them at any time.

| Tier | Meaning |
| --- | --- |
| Tier 1 | Small amounts, such as a small discount or advance |
| Tier 2 | Medium amounts, for department managers |
| Tier 3 | Large amounts, for the GM and CEO |
| Unlimited | Board level |
