# S23. Recruitment

[All screens](README.md) · [Module spec](../../modules/23-recruitment.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s23-01"></a>S23-01 | Vacancies | Web | `/recruitment/vacancies` | Open jobs with applicants count | Role home | S23-02 Vacancy editor, S23-05 Applicants |
| <a id="s23-02"></a>S23-02 | Vacancy editor | Web | `/recruitment/vacancy-editor/:id` | Job details, requirements and where it is advertised | S23-01 Vacancies | Back only |
| <a id="s23-03"></a>S23-03 | Jobs page | Public | `/recruitment/jobs-page` | Public list of open jobs | [S75-01 Website home](75-public-website.md#s75-01) | S23-04 Apply for job |
| <a id="s23-04"></a>S23-04 | Apply for job | Public | `/recruitment/apply-for-job` | Application form with CV upload | S23-03 Jobs page | Back only |
| <a id="s23-05"></a>S23-05 | Applicants | Web | `/recruitment/applicants` | Applicants per vacancy, with stages | Role home, S23-01 Vacancies | S23-06 Applicant detail, S23-07 Interview schedule |
| <a id="s23-06"></a>S23-06 | Applicant detail | Web | `/recruitment/applicant-detail/:id` | CV, answers, notes, scores and interview history | S23-05 Applicants | D23-01 Move stage, D23-02 Send offer, D23-03 Reject applicant |
| <a id="s23-07"></a>S23-07 | Interview schedule | App, Web | `/recruitment/interview-schedule` | Interviews by date with panel | S23-05 Applicants | S23-08 Interview score |
| <a id="s23-08"></a>S23-08 | Interview score | App, Web | `/recruitment/interview-score` | Scoring form for each panel member | S23-07 Interview schedule | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d23-01"></a>D23-01 | Move stage | Shortlist, interview, offer or reject | S23-06 Applicant detail |
| <a id="d23-02"></a>D23-02 | Send offer | Offer letter with start date and pay | S23-06 Applicant detail |
| <a id="d23-03"></a>D23-03 | Reject applicant | Reason and message | S23-06 Applicant detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
