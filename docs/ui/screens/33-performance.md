# S33. Performance & Appraisals

[All screens](README.md) · [Module spec](../../modules/33-performance.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s33-01"></a>S33-01 | My appraisals | App | `/performance/my-appraisals` | My goals, reviews and scores | Role home | S33-02 Appraisal form |
| <a id="s33-02"></a>S33-02 | Appraisal form | App, Web | `/performance/appraisal-form` | Self, manager and peer review | S33-01 My appraisals, S33-03 Appraisals list | D33-01 Submit appraisal, D33-02 Sign appraisal |
| <a id="s33-03"></a>S33-03 | Appraisals list | Web | `/performance/appraisals-list` | Appraisals by cycle, department and status | Role home | S33-02 Appraisal form, S33-04 Goals, S33-05 Probation reviews, S33-06 Appraisal cycles |
| <a id="s33-04"></a>S33-04 | Goals | App, Web | `/performance/goals` | Goals for a person or team | S33-03 Appraisals list | Back only |
| <a id="s33-05"></a>S33-05 | Probation reviews | Web | `/performance/probation-reviews` | New staff with probation reviews due | Role home, S33-03 Appraisals list | Back only |
| <a id="s33-06"></a>S33-06 | Appraisal cycles | Web | `/performance/appraisal-cycles` | Cycles, forms and deadlines | S33-03 Appraisals list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d33-01"></a>D33-01 | Submit appraisal | Confirm and send for review | S33-02 Appraisal form |
| <a id="d33-02"></a>D33-02 | Sign appraisal | Employee signs to agree or disagree | S33-02 Appraisal form |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
