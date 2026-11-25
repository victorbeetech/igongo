# S34. Training & Certificates

[All screens](README.md) · [Module spec](../../modules/34-training.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s34-01"></a>S34-01 | My training | App | `/training/my-training` | Courses, certificates and what is due | Role home | S34-03 Course player, S34-05 Certificates |
| <a id="s34-02"></a>S34-02 | Courses | App, Web | `/training/courses` | Courses and materials | Role home | D34-01 Enrol, S34-04 Training sessions, S34-06 Training matrix |
| <a id="s34-03"></a>S34-03 | Course player | App | `/training/course-player/:id` | Lessons, videos and quiz | S34-01 My training | Back only |
| <a id="s34-04"></a>S34-04 | Training sessions | App, Web | `/training/training-sessions` | Classroom sessions with attendance by card tap | S34-02 Courses | Back only |
| <a id="s34-05"></a>S34-05 | Certificates | App, Web | `/training/certificates` | Certificates with expiry dates | S34-01 My training | D34-02 Certificate expiring |
| <a id="s34-06"></a>S34-06 | Training matrix | Web | `/training/training-matrix` | Who has which training, by role | S34-02 Courses | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d34-01"></a>D34-01 | Enrol | Add people to a course or session | S34-02 Courses |
| <a id="d34-02"></a>D34-02 | Certificate expiring | Remind and book a refresher | S34-05 Certificates |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
