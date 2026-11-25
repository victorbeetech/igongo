# S08. Forms & Templates Builder

[All screens](README.md) · [Module spec](../../modules/08-forms-builder.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s08-01"></a>S08-01 | Forms library | Web | `/forms-builder/forms-library` | All forms, checklists and templates | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S08-02 Form designer, S08-08 Form submissions |
| <a id="s08-02"></a>S08-02 | Form designer | Web | `/forms-builder/form-designer` | Drag and drop fields, sections, logic and scoring | S08-01 Forms library | S08-03 Form logic, S08-04 Form settings, S08-05 Form preview, S08-06 Form versions |
| <a id="s08-03"></a>S08-03 | Form logic | Web | `/forms-builder/form-logic` | Show, hide and require rules | S08-02 Form designer | Back only |
| <a id="s08-04"></a>S08-04 | Form settings | Web | `/forms-builder/form-settings` | Who fills it, how often, deadlines and attachment to a module | S08-02 Form designer | Back only |
| <a id="s08-05"></a>S08-05 | Form preview | App, Web | `/forms-builder/form-preview` | Fill the form as a test | S08-02 Form designer | D08-01 Publish form |
| <a id="s08-06"></a>S08-06 | Form versions | Web | `/forms-builder/form-versions` | Versions and what changed | S08-02 Form designer | Back only |
| <a id="s08-07"></a>S08-07 | Fill form | App, Kiosk | `/forms-builder/fill-form` | The live form for staff, online or offline | Role home | S08-09 Submission detail |
| <a id="s08-08"></a>S08-08 | Form submissions | Web | `/forms-builder/form-submissions` | Submitted answers with filters and export | S08-01 Forms library | S08-09 Submission detail |
| <a id="s08-09"></a>S08-09 | Submission detail | App, Web | `/forms-builder/submission-detail/:id` | One submitted form with photos and signature | S08-07 Fill form, S08-08 Form submissions | Back only |
| <a id="s08-10"></a>S08-10 | Public form | Public | `/forms-builder/public-form` | A form for guests, such as an event enquiry | [S75-01 Website home](75-public-website.md#s75-01) | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d08-01"></a>D08-01 | Publish form | Confirm and pick start date | S08-05 Form preview |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
