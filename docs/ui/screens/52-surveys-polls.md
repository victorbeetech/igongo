# S52. Surveys & Polls

[All screens](README.md) · [Module spec](../../modules/52-surveys-polls.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s52-01"></a>S52-01 | Surveys | App, Web | `/surveys-polls/surveys` | Open and closed surveys and polls | Role home | S52-02 Answer survey, S52-03 Survey builder, S52-04 Survey results |
| <a id="s52-02"></a>S52-02 | Answer survey | App | `/surveys-polls/answer-survey` | Questions, anonymous if set | S52-01 Surveys | D52-01 Submit answers |
| <a id="s52-03"></a>S52-03 | Survey builder | Web | `/surveys-polls/survey-builder` | Questions, audience and dates | S52-01 Surveys | Back only |
| <a id="s52-04"></a>S52-04 | Survey results | App, Web | `/surveys-polls/survey-results` | Answers and charts | S52-01 Surveys | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d52-01"></a>D52-01 | Submit answers | Confirm, with anonymity note | S52-02 Answer survey |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
