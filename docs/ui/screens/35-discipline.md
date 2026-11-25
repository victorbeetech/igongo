# S35. Discipline & Cases

[All screens](README.md) · [Module spec](../../modules/35-discipline.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s35-01"></a>S35-01 | Cases | Web | `/discipline/cases` | Disciplinary cases by status | Role home | S35-02 Case detail, S35-03 Open case, S35-05 Warnings, S35-06 Discipline settings |
| <a id="s35-02"></a>S35-02 | Case detail | Web | `/discipline/case-detail/:id` | Incident, evidence, hearings, outcome and appeal | S35-01 Cases | D35-02 Schedule hearing, D35-03 Record outcome |
| <a id="s35-03"></a>S35-03 | Open case | Web | `/discipline/open-case` | Person, incident, evidence and witnesses | S35-01 Cases | Back only |
| <a id="s35-04"></a>S35-04 | My cases | App | `/discipline/my-cases` | Letters and outcomes addressed to me | Role home | Back only |
| <a id="s35-05"></a>S35-05 | Warnings | Web | `/discipline/warnings` | Active warnings and their expiry | S35-01 Cases | D35-01 Issue warning |
| <a id="s35-06"></a>S35-06 | Discipline settings | Web | `/discipline/discipline-settings` | Offence categories and suggested actions; Case steps and letter templates; Who can open, see and close cases; Warning expiry periods | S35-01 Cases | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d35-01"></a>D35-01 | Issue warning | Type, reason and expiry | S35-05 Warnings |
| <a id="d35-02"></a>D35-02 | Schedule hearing | Date, panel and notice to the person | S35-02 Case detail |
| <a id="d35-03"></a>D35-03 | Record outcome | Outcome, letter and appeal window | S35-02 Case detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
